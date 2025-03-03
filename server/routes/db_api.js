
const express = require("express")
const router = express.Router()

//this get function sends all the results to the client stored in the database as a json object
router.get('/', async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_TABLENAME}`);
        res.json(results);
    } catch (error) {
        //basic error handling
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
})

//this function checks if all the fields are filled, then checks if the user already exists then inserts the data from req.body into the database and also sends the created user to the user as a json object
router.post("/", async (req, res) => {
    console.log(req.body);
    const { id, fullName, phoneNumber, email, biharDistrict, referredBy, profileUrl, createdAt, status, points,
        countryCode, isRegistered, isMember, currentCountry, currentState } = req.body;

    // check if name or email is missing or empty
    // if (!name || !email || name === '' || email === '') {
    //     return res.status(400).send('All fields are required');
    // }

    try {
        // check if the user already exists
        const [checkResults] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE phone_number = ?`, [phoneNumber]);
        if (checkResults[0].count > 0) {
            return res.status(409).send('User already exists');
        }

        // create the new user
        const [insertResults] = await req.pool.query(`INSERT INTO ${process.env.DB_TABLENAME} (id, full_name, phone_number, email, bihar_district, referred_by, profile_url, created_at, status, points,
            country_code, is_registered, is_member, current_country, current_state) VALUES (?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?)`, [id, fullName, phoneNumber, email, biharDistrict, referredBy, profileUrl, createdAt, status, points,
            countryCode, isRegistered, isMember, currentCountry, currentState]);

        // send a success response
        res.status(201).json({ id: insertResults.insertId, fullName, phoneNumber, email });
    } catch (error) {
        //basic error handling
        console.error("Error inserting data: ", error);
        res.status(500).send("Internal server error");
    }
});


// app.post("/users", (req, res) => {
//     const q = "INSERT INTO nrb_users (`id`,`full_name`,`phone_number`,`country_code`,'email','bihar_district','referred_by','is_registered','is_member','current_country','current_state','created_at') VALUES (?)";
//     const values = [
//         req.body.id,
//         req.body.full_name,
//         req.body.phone_number,
//         req.body.country_code,
//         req.body.email,
//         req.body.bihar_district,
//         req.body.referred_by,
//         req.body.is_registered,
//         req.body.is_member,
//         req.body.current_country,
//         req.body.current_state,
//         req.body.created_at
//     ]
//     db.query(q, [values], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("user has been added.")
//     })

// })

// app.delete("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     const q = "DELETE FROM nrb_users WHERE id=?"

//     db.query(q, [userId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("user has been deleted.")
//     })
// })

// app.put("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     const q = "UPDATE nrb_users SET `title`=?,`desc`=?,`price`=?,`cover`=? WHERE id=?"
//     const values = [
//         req.body.title,
//         req.body.desc,
//         req.body.price,
//         req.body.cover
//     ]
//     db.query(q, [...values, userId], (err, data) => {
//         if (err) return res.json(err)
//         return res.json("User has been updated.")
//     })
// })

// app.listen(8800, () => {
//     console.log("Connect to backend.")
// })
module.exports = router;