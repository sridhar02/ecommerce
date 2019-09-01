package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"net/http"
)

type User struct {
	ID          string    `json:"id,omiempty`
	Username    string    `json:"username,omiempty"`
	Password    string    `json:"password,omiempty"`
	Age         int       `json:"age,omiempty"`
	Sex         string    `json:"sex,omiempty"`
	Phonenumber string    `json:"phonenumber,omiempty"`
	Email       string    `json:"email,omiempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}

func CreateUser(db *sql.DB, user User) error {

	_, err = db.Exec(`INSERT INTO users(username,email,password,phonenumber)
									VALUES($1,$2,$3,$4)`,

		user.Username,
		user.Email,
		user.password,
		user.Phonenumber)
}

func postUserHandler(c *gin.Context, db *sql.DB) {

	user := User{}
	err := c.BindJSON(&user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	err = CreateUser(db, user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.Status(http.StatusCreated)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	connStr := "user=postgres dbname = ecommerce_website host=localhost password=test1234 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Println(err)
		return
	}

	router := gin.Default()
	http.Handle("/", router)

	router.POST("/user/signup", func(c *gin.context) { postUserHandler(c, db) })

	http.ListenAndServe(":8000", nil)
	http.ListenAndServe(":8000/signin", nil)

}
