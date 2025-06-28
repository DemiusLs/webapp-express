import connection from "../db.js";

const index = (req, res) => {



    const sql = `SELECT movies.* , ROUND(AVG(reviews.vote) , 2) AS avg_vote FROM movies 
    LEFT JOIN  reviews ON movies.id = reviews.movie_id GROUP BY movies.id`;

    connection.query(sql, (err, results) => {

        const movies = results.map((curMovie) => {
            return {
                ...curMovie,
                image: `${req.imagePath}${curMovie.image}`
            }
        })

        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(movies);
    });

}

const show = (req, res) => {

    const id = req.params.id
    const sqlMovies = `SELECT movies.* , ROUND(AVG(reviews.vote) , 2) AS avg_vote FROM movies 
    LEFT JOIN  reviews ON movies.id = reviews.movie_id GROUP BY movies.id`;
    const sqlReview = 'SELECT * FROM reviews WHERE movie_id= ?';

    connection.query(sqlMovies, [id], (err, moviesResults) => {



        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (moviesResults.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        } else {

            connection.query(sqlReview, [id], (err, reviewsResults) => {

                
                res.json({
                    data: {
                        ...moviesResults[0],
                        image: `${req.imagePath}${moviesResults[0].image}`,
                        reviews: reviewsResults,
                    },
                });

            })


        }


    });

}

const store = (req, res) => {

    res.json(
        "risposta da store"
    )
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


export default { index, show, store, update, destroy }