

const index = (req, res) => {

    const result = "risposta da index"
    res.json(result)

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