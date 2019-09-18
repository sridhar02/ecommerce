package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Cart struct {
	ProductId int `json:"product_id,omitempty"`
	UserId    int `json:"user_id,omitempty"`
}

func postToCartHandler(c *gin.Context, db *sql.DB) {

	userId, err := authorization(c, db)
	if err != nil {
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

func getCartHandler(c *gin.Context, db *sql.DB) {

	userId, err := authorization(c, db)
	if err != nil {
		return
	}

	rows, err := db.Query(`SELECT products.id,products.name,products.image FROM products JOIN 
	                         cart ON cart.product_id = products.id 	where  cart.user_id =  $1`, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	products := []Product{}
	for rows.Next() {
		var id int
		var image, name string
		err = rows.Scan(&id, &name, &image)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		product := Product{
			Id:    id,
			Name:  name,
			Image: image,
		}
		products = append(products, product)
	}

	c.JSON(http.StatusOK, products)

}
