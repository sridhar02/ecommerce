package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func postOrderHandler(c *gin.Context, db *sql.DB) {

	userId, err := authorization(c, db)
	if err != nil {
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
	row := db.QueryRow(`SELECT id FROM orders WHERE user_id=$1`, userId)
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
