import Users from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll()
        res.json(users)
    } catch (error) {
        console.error(error)
    }
}

const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) res.status(400).json({ message: "Password dan Confirm Password Tidak Cocok !" })

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    try {
        await Users.create({
            name,
            email,
            password: hashPassword
        })
        res.json({ message: "Register Berhasil !" })
    } catch (error) {
        console.error(error)
        res.json({ message: "Register GAGAL !" })
    }
}

const loginUser = async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, users[0].password)
        if (!match) res.status(400).json({ message: "Password salah !" })
        const userId = users[0].id
        const name = users[0].name
        const email = users[0].email
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({ message: "Email tidak ditemukan !" })
        console.error(error)
    }
}

export {
    getUsers,
    registerUser,
    loginUser
}