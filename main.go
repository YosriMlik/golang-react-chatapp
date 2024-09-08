package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

// A simple WebSocket chat room
type Client struct {
	ID   string
	Conn *websocket.Conn
}

var clients = make(map[*websocket.Conn]bool) // Connected clients
var broadcast = make(chan string)            // Broadcast channel

func main() {
	app := fiber.New()

	// WebSocket route
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		defer func() {
			c.Close()
			delete(clients, c)
		}()

		clients[c] = true

		for {
			// Read message from client
			_, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				break
			}
			// Send the received message to the broadcast channel
			broadcast <- string(msg)
		}
	}))

	// Goroutine to listen for messages and broadcast them to all clients
	go func() {
		for {
			msg := <-broadcast
			for client := range clients {
				if err := client.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
					log.Printf("Error sending message: %v", err)
					client.Close()
					delete(clients, client)
				}
			}
		}
	}()

	// Middleware to serve static files for all routes except `/ws`
	app.Use(func(c *fiber.Ctx) error {
		if c.Path() == "/ws" {
			return c.Next()
		}

		// Serve static files
		if filepath.Ext(c.Path()) == "" || c.Path() == "/" {
			return c.SendFile("./frontend/dist/index.html")
		}

		// Check if file exists and serve it
		if _, err := os.Stat("./frontend/dist" + c.Path()); !os.IsNotExist(err) {
			return c.SendFile("./frontend/dist" + c.Path())
		}

		// Serve a 404 if the file does not exist
		return c.SendStatus(fiber.StatusNotFound)
	})

	// Start the Fiber server
	log.Fatal(app.Listen(":4000"))
}
