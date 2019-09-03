package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"time"
)

type User struct {
	ID          string    `json:"id,omiempty`
	Username    string    `json:"username,omiempty"`
	Email       string    `json:"email,omiempty"`
	Phonenumber string    `json:"phonenumber,omiempty"`
	Password    string    `json:"password,omiempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}

func CreateUser(db *sql.DB, user User) error {

	_, err := db.Exec(`INSERT INTO users(username,email,password,phonenumber,created_at,updated_at)
									VALUES($1,$2,$3,$4,$5,$6)`,

		user.Username,
		user.Email,
		user.Password,
		user.Phonenumber,
		time.Now().Format(time.RFC3339),
		time.Now().Format(time.RFC3339))

	if err != nil {
		return err
	}
	return nil
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

func PostUserSigninPageHandler(c *gin.Context, db *sql.DB) {

	user := User{}
	err := c.BindJSON(&user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var Password, Id string
	row := db.QueryRow(`SELECT password,id FROM users WHERE email=$1`, user.Email)
	err = row.Scan(&Password, &Id)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	if Password != user.Password {
		c.Status(http.StatusUnauthorized)
		return
	}
	// c.Redirect(http.StatusFound, "http://localhost:3000/")

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

	router.POST("/user/signup", func(c *gin.Context) { postUserHandler(c, db) })
	router.POST("/user/sign_in", func(c *gin.Context) { PostUserSigninPageHandler(c, db) })

	http.ListenAndServe(":8000", nil)
	http.ListenAndServe(":8000/signin", nil)

}
