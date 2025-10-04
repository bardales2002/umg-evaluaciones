import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req,res)=>{
  try{
    const [rows] = await pool.query('SELECT id, nombre, curso FROM profesores ORDER BY nombre');
    res.json({ ok:true, data: rows });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, message:'Error al obtener profesores' });
  }
});

export default router;
