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