import connection from "../db.js";

const index = (req, res) => {

    const sql = 'SELECT * FROM movies';

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });

}

const show = (req, res) => {

    const id = req.params.id

    res.json(
        `risposta da show con id ${id}`
    )

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