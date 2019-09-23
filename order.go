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
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusCreated)
}

type OrderResponse struct {
	ID        int       `json:"id,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	Products  []Product `json:"products"`
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

	var Id int
	var createdAt time.Time
	orderResponses := []OrderResponse{}
	for rows.Next() {
		err = rows.Scan(&Id, &createdAt)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		orderResponse := OrderResponse{
			ID:        Id,
			CreatedAt: createdAt,
		}
		orderResponses = append(orderResponses, orderResponse)
	}

	for i, orderResponse := range orderResponses {
		rows, err := db.Query(`SELECT products.id,products.name,products.image,products.price FROM order_products JOIN 
							   products ON order_products.product_id= products.id WHERE order_id =$1`,
			orderResponse.ID)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		products := []Product{}
		for rows.Next() {
			var id, price int
			var name, image string
			err = rows.Scan(&id, &name, &image, &price)
			if err != nil {
				fmt.Println(err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			product := Product{
				Id:    id,
				Name:  name,
				Image: image,
				Price: price,
			}
			products = append(products, product)
		}
		orderResponses[i].Products = products
	}

	c.JSON(http.StatusOK, orderResponses)
}
