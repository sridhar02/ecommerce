package main

import (
	"database/sql"
	"fmt"
	// "log"
	// "math/rand"
	"net/http"
	"strings"
	// "time"

	// sq "github.com/Masterminds/squirrel"
	"github.com/gin-gonic/gin"
)

type Cart struct {
	ProductId int `json:"product_id,omitempty"`
	UserId    int `json:"user_id,omitempty"`
}

func postToCartHandler(c *gin.Context, db *sql.DB) {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")

	var userId int
	row := db.QueryRow(`SELECT user_id FROM logins WHERE secret=$1`, secret)
	err := row.Scan(&userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	cart := Cart{}
	err = c.BindJSON(&cart)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(`INSERT INTO cart(product_id,user_id)VALUES($1,$2)`, cart.ProductId, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusCreated)
}

func postOrderHandler(c *gin.Context, db *sql.DB) {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")

	var userId int
	row := db.QueryRow(`SELECT user_id FROM logins WHERE secret=$1`, secret)
	err := row.Scan(&userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(`INSERT INTO orders(user_id)VALUES($1)`, userId)
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

	var orderId int
	row = db.QueryRow(`SELECT id FROM orders WHERE user_id=$1`, userId)
	err = row.Scan(&orderId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
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

	c.Status(http.StatusCreated)

}
