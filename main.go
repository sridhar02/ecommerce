package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"
	"math/rand"
	"net/http"
	"strings"
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
type Login struct {
	UserId    int       `json:"user_id,omitempty"`
	Secret    string    `json:"secret,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
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

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	var i int
	for i = range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func CreateLogin(db *sql.DB, userId int) (Login, error) {

	secret := RandStringBytes(32)
	_, err := db.Exec(`INSERT INTO logins(user_id,secret,created_at,updated_at)
									VALUES($1,$2,$3,$4)`,
		userId,
		secret,
		time.Now().Format(time.RFC3339),
		time.Now().Format(time.RFC3339))

	// createdAt := time.Now().Format(time.RFC3339)
	// updatedAt := time.Now().Format(time.RFC3339)

	// CreatedAt, err := time.Parse(time.RFC3339, createdAt)

	// if err != nil {
	// 	return User{}, err
	// }

	// UpdatedAt, err := time.Parse(time.RFC3339, updatedAt)

	// if err != nil {
	// 	return User{}, err
	// }
	login := Login{
		UserId:    userId,
		Secret:    secret,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err != nil {
		return login, err
	}

	return login, nil
}
func PostUserSigninPageHandler(c *gin.Context, db *sql.DB) {

	user := User{}
	err := c.BindJSON(&user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var Password string
	var Id int
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

	login, err := CreateLogin(db, Id)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// c.Redirect(http.StatusFound, "http://localhost:3000/")

	c.JSON(201, login)
}

func deleteUserlogin(c *gin.Context, db *sql.DB) error {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")
	_, err := db.Exec(`DELETE FROM logins WHERE secret= $1`, secret)
	if err != nil {
		return err
	}

	return nil
}

func getProductsHandler(c *gin.Context, db *sql.DB) {

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
	router.DELETE("/login", func(c *gin.Context) { deleteUserlogin(c, db) })
	router.GET("/products", func(c *gin.Context) { getProductsHandler(c, db) })

	http.ListenAndServe(":8000", nil)
	http.ListenAndServe(":8000/signin", nil)

}
