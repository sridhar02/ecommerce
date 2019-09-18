package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type User struct {
	ID          string    `json:"id,omiempty`
	Username    string    `json:"username,omiempty"`
	Email       string    `json:"email,omiempty"`
	Phonenumber string    `json:"phonenumber,omiempty"`
	Password    string    `json:"password,omiempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	Name        string    `json:"Name,omitempty"`
	Sex         string    `json:"sex,omitempty`
}
type Login struct {
	UserId    int       `json:"user_id,omitempty"`
	Secret    string    `json:"secret,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

var psql = sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

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

func postUserSignupHandler(c *gin.Context, db *sql.DB) {

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
func PostUserSigninHandler(c *gin.Context, db *sql.DB) {

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

func deleteLoginHandler(c *gin.Context, db *sql.DB) error {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")
	_, err := db.Exec(`DELETE FROM logins WHERE secret= $1`, secret)
	if err != nil {
		return err
	}

	return nil
}

type Product struct {
	Id    int    `json:"id,omitempty"`
	Name  string `json:"name,omitempty"`
	Image string `json:"image,omitempty"`
}

func getProductsHandler(c *gin.Context, db *sql.DB) {

	rows, err := db.Query(`SELECT * FROM products`)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var name, image string
	var id int
	products := []Product{}
	for rows.Next() {
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

func userUpdateHandler(c *gin.Context, db *sql.DB) {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")

	if secret == "" {
		c.Status(http.StatusUnauthorized)
		return
	}

	var userId int
	row := db.QueryRow(`SELECT user_id FROM logins WHERE secret=$1`, secret)
	err := row.Scan(&userId)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	user := User{}
	err = c.BindJSON(&user)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	query := psql.Update("users")
	if user.Name != "" {
		query = query.Set("name", user.Name)
	}
	if user.Sex != "" {
		query = query.Set("sex", user.Sex)
	}
	if user.Email != "" {
		query = query.Set("email", user.Email)
	}
	fmt.Println(user.Phonenumber)
	if user.Phonenumber != "" {
		query = query.Set("phonenumber", user.Phonenumber)
	}
	query = query.Where(sq.Eq{"id": userId})

	q, args, err := query.ToSql()

	_, err = db.Exec(q, args...)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusNoContent)
}

func authorization(c *gin.Context, db *sql.DB) (int, error) {

	value := c.GetHeader("Authorization")
	secret := strings.TrimPrefix(value, "Bearer ")

	var userId int
	row := db.QueryRow(`SELECT user_id FROM logins WHERE secret=$1`, secret)
	err := row.Scan(&userId)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusUnauthorized)
			return 0, err
		} else {
			c.AbortWithStatus(http.StatusInternalServerError)
			return 0, err
		}
	}

	return userId, nil

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
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "GET", "DELETE", "POST", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	http.Handle("/", router)

	router.POST("/user/signup", func(c *gin.Context) { postUserSignupHandler(c, db) })
	router.POST("/user/sign_in", func(c *gin.Context) { PostUserSigninHandler(c, db) })
	router.DELETE("/login", func(c *gin.Context) { deleteLoginHandler(c, db) })
	router.GET("/products", func(c *gin.Context) { getProductsHandler(c, db) })
	router.PUT("/user", func(c *gin.Context) { userUpdateHandler(c, db) })
	router.POST("/cart", func(c *gin.Context) { postToCartHandler(c, db) })
	router.POST("/orders", func(c *gin.Context) { postOrderHandler(c, db) })
	router.GET("/cart", func(c *gin.Context) { getCartHandler(c, db) })

	http.ListenAndServe(":8000", nil)
	http.ListenAndServe(":8000/signin", nil)

}
