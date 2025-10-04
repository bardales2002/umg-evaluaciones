import { Router } from 'express';
import { pool } from '../db.js';
import { createEvaluacionRules, validate } from '../validators/evaluaciones.validators.js';

const router = Router();

router.post('/', createEvaluacionRules, validate, async (req,res)=>{
  const { profesor_id, q1,q2,q3,q4,q5, comentario } = req.body;

  try{
    const [prof] = await pool.query('SELECT id FROM profesores WHERE id=?',[profesor_id]);
    if(prof.length===0) return res.status(404).json({ ok:false, message:'Profesor no encontrado' });

    await pool.query(
      `INSERT INTO evaluaciones (profesor_id,q1,q2,q3,q4,q5,comentario)
       VALUES (?,?,?,?,?,?,?)`,
      [profesor_id,q1,q2,q3,q4,q5,comentario]
    );
    res.status(201).json({ ok:true, message:'Evaluación registrada' });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, message:'Error al registrar la evaluación' });
  }
});

export default router;
