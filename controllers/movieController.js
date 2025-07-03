import slugify from "slugify";
import connection from "../db.js";
import fs from "fs";
const index = (req, res) => {

    const search = req.query.search



    let sql = `SELECT movies.* , ROUND(AVG(reviews.vote) , 2) AS avg_vote 
    FROM movies 
    LEFT JOIN  reviews ON movies.id = reviews.movie_id  `;
    const params = [];

    if (search !== undefined) {
        sql += `
      WHERE movies.title LIKE ?
    `;
        params.push(`%${search}%`);
    }

    sql += ` GROUP BY movies.id`



    connection.query(sql, params, (err, results) => {

        const movies = results.map((curMovie) => {
            return {
                ...curMovie,
                image: curMovie.image ? `${req.imagePath}/${curMovie.image}` : null
            }
        })

        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(movies);
    });

}

const show = (req, res) => {

    const slug = req.params.slug
    const sqlMovies = `SELECT movies.* , ROUND(AVG(reviews.vote) , 2) AS avg_vote FROM movies 
    LEFT JOIN  reviews ON movies.id = reviews.movie_id WHERE movies.slug = ? GROUP BY movies.id`;
    const sqlReview = 'SELECT * FROM reviews WHERE movie_id= ?';

    connection.query(sqlMovies, [slug], (err, moviesResults) => {



        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (moviesResults.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        } else {

            const movieData = moviesResults[0]

            connection.query(sqlReview, [movieData.id], (err, reviewsResults) => {

                console.log()

                res.json({
                    data: {
                        ...movieData,
                        image: movieData.image ? `${req.imagePath}/${movieData.image}` : null,
                        reviews: reviewsResults,
                    },
                });

            })


        }


    });

}

const validateRequest = (req) => {


    const { title, director, abstract } = req.body;

    console.log(title, director, abstract)
    if (!title || !director) {
        return false;
    }
    if (title.length < 4 || director.length < 4 || abstract.length < 20) {
        return false;
    }

    return true;
};


const store = (req, res, next) => {


    // controllo i dati
    if (!validateRequest(req)) {
        return res.status(400).json({
            message: "Dati errati",
        });
    }
    console.log(validateRequest(req));

    console.log("Creo movie")

    const { title, director, abstract } = req.body;

    let image = null

    if (req.file) {
        image = req.file.filename
    }





    console.log(title, director, abstract);

    const slug = slugify(title, {
        lower: true,
        strinct: true,
    });

    const sql = `
     INSERT INTO movies (slug, title, director, abstract, image)
     VALUES (?, ?, ?, ?, ?);
   `;



    // Eseguiamo la query
    connection.query(sql, [slug, title, director, abstract, image], (err, results) => {
        //  Se c'è errore lo gestiamo
        if (err) {
            return next(new Error(err));
        }

        //  Invio la risposta con il codie 201 e id e slug
        return res.status(201).json({
            id: results.insertId,
            slug,
        });
    });
};

const storeReview = (req, res, next) => {

    const { id } = req.params;

    const movieSql = `SELECT * 
    FROM movies
    WHERE movies.id = ?
    `

    console.log("storing")

    connection.query(movieSql, [id], (err, moviesResults) => {
        if (moviesResults.length === 0) {
            return res.status(404).json({
                error: "Movie non trovato",
            });
        }

        const { name, vote, text } = req.body;

        console.log(name, vote, text)


        const newReviewSql = ` INSERT INTO reviews(movie_id , name , vote ,text)
        VALUES (? , ? , ? , ?)`;


        connection.query(newReviewSql, [id, name, vote, text], (err, results) => {

            if (err) {
                return next(new Error(err));
            }

            return res.status(201).json({
                message: "Review created",
                id: results.insertId
            })

        })
    })


}




const update = (req, res) => {

    const id = req.params.id
    res.json(
        `risposta da update con id ${id}`
    )
}

const destroy = (req, res) => {

    const id = req.params.id
    res.json(
        `risposta da destroy con id ${id}`
    )
}


export default { index, show, store, storeReview, update, destroy }