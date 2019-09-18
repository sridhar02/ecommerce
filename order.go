package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func postOrderHandler(c *gin.Context, db *sql.DB) {

	userId, err := authorization(c, db)
	if err != nil {
		return
	}

	var orderId int
	err = db.QueryRow(`INSERT INTO orders (user_id,created_at) VALUES($1,$2) RETURNING id`,
		userId, time.Now().Format(time.RFC3339)).Scan(&orderId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	rows, err := db.Query(`SELECT product_id FROM cart WHERE user_id = $1`, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var productId int
	productIds := []int{}
	for rows.Next() {
		err = rows.Scan(&productId)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		productIds = append(productIds, productId)
	}

	for _, productId := range productIds {

		_, err = db.Exec(`INSERT INTO order_products(order_id,product_id)VALUES($1,$2)`,
			orderId, productId)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
	}

	_, err = db.Exec(`DELETE FROM cart  WHERE user_id= $1`, userId)
	if err != nil {
		return
	}

	c.Status(http.StatusCreated)
}

type OrderResponse struct {
	OrderId   int       `json:"order_id,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	Products  []Product `json:"products,omitempty"`
}

func getOrdersHandler(c *gin.Context, db *sql.DB) {

	userId, err := authorization(c, db)
	if err != nil {
		return
	}

	rows, err := db.Query(`SELECT id,created_at FROM orders WHERE user_id=$1`, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var orderId int
	var createdAt string
	orderIds := []int{}
	for rows.Next() {
		err = rows.Scan(&orderId, &createdAt)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		orderIds = append(orderIds, orderId)
	}

	CreatedAt, err := time.Parse(time.RFC3339, createdAt)

	if err != nil {
		return
	}

	orderResponses := []OrderResponse{}

	for _, orderId := range orderIds {
		rows, err := db.Query(`SELECT products.name,products.image FROM order_products JOIN 
								products ON order_products.product_id= products.id WHERE order_id =$1`, orderId)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		products := []Product{}
		for rows.Next() {
			var name, image string
			err = rows.Scan(&name, &image)
			if err != nil {
				fmt.Println(err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			product := Product{
				Name:  name,
				Image: image,
			}
			products = append(products, product)
		}
		orderResponse := OrderResponse{
			OrderId:   orderId,
			CreatedAt: CreatedAt,
			Products:  products,
		}
		orderResponses = append(orderResponses, orderResponse)
	}

	c.JSON(http.StatusOK, orderResponses)
}
