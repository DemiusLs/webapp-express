import slugify from "slugify";
import connection from "../db.js";

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

const store = (req, res) => {
    console.log("Creo movie")

    const { title, director, abstract } = req.body;

    console.log(title, director, abstract);

    const slug = slugify(title, {
        lower: true,
        strinct: true,
    });

    const sql = `
     INSERT INTO movies (slug, title, director, abstract)
     VALUES (?, ?, ?, ?);
   `;

    console.log(sql);

    // Eseguiamo la query
    connection.query(sql, [slug, title, director, abstract], (err, results) => {
        //  Se c'è errore lo giestiamo

        //  Invio la risposta con il codie 201 e id e slug
        return res.status(201).json({
            id: results.insertId,
            slug,
        });
    });
};

const storeReview = (req, res) => {

    const { id } = req.params;

    const movieSql = `SELECT * 
    FROM movies
    WHERE movies.id = ?
    `

    connection.query(sql, [id], (err, moviesResults) => {
        if (bookResults.length === 0) {
            return res.status(404).json({
                error: "Libro non trovato",
            });
        }

        const { name, vote, text } = req.body;

        console.log(name, vote, text)


        const newReviewSql = ` INSERT INTO reviews(book_id , name , vote ,text)
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