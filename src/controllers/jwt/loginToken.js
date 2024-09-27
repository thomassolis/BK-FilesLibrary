import jwt from 'jsonwebtoken';


const JWT_SECRET = 'por la causa!';
export const generateJWT = async(userData) =>{

    const token = jwt.sign(
        userData,
        JWT_SECRET,
        { expiresIn: '1h' }  // El token expira en 1 hora
    );


}