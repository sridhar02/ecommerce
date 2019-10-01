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
	Quantity  int `json:"quantity,omitempty"`
}

type CartProduct struct {
	Id       int    `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
	Image    string `json:"image,omitempty"`
	Price    int    `json:"price,omitempty"`
	Quantity int    `json:"quantity,omitempty"`
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

	var count int
	row := db.QueryRow(`SELECT count(*) FROM cart WHERE user_id = $1 AND product_id = $2`, userId, cart.ProductId)
	err = row.Scan(&count)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if count == 1 {
		c.Status(http.StatusExpectationFailed)
		return
	}
	_, err = db.Exec(`INSERT INTO cart(product_id,user_id,Quantity)VALUES($1,$2,$3)`, cart.ProductId, userId, 1)
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

	rows, err := db.Query(`SELECT products.id,products.name,products.image,products.price,cart.quantity FROM 
		                 products JOIN cart ON cart.product_id = products.id WHERE cart.user_id =  $1 
		                 ORDER BY products.id ASC`, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	cartProducts := []CartProduct{}
	for rows.Next() {
		var id, price, quantity int
		var image, name string
		err = rows.Scan(&id, &name, &image, &price, &quantity)
		if err != nil {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		cartProduct := CartProduct{
			Id:       id,
			Name:     name,
			Image:    image,
			Price:    price,
			Quantity: quantity,
		}
		cartProducts = append(cartProducts, cartProduct)
	}

	c.JSON(http.StatusOK, cartProducts)

}

func updateCartHandler(c *gin.Context, db *sql.DB) {

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

	_, err = db.Exec(`UPDATE cart SET quantity= $1 WHERE product_id=$2 AND user_id= $3`,
		cart.Quantity, cart.ProductId, userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusNoContent)
}
