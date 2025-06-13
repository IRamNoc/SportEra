import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Register User
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points
    };

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      user: userData
    });

  } catch (error: any) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points
    };

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// Get current user (protected route)
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points
    };

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

export default router;