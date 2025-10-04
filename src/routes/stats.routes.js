import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req,res)=>{
  const { profesor_id } = req.query;

  try{
    const [generalRows] = await pool.query(`
      SELECT COUNT(*) total_respuestas,
             ROUND(AVG((q1+q2+q3+q4+q5)/5),2) promedio_general
      FROM evaluaciones
    `);

    const [porProfesor] = await pool.query(`
      SELECT p.id profesor_id, p.nombre, p.curso,
             COUNT(e.id) cantidad_respuestas,
             COALESCE(ROUND(AVG((e.q1+e.q2+e.q3+e.q4+e.q5)/5),2),0) calificacion_promedio
      FROM profesores p
      LEFT JOIN evaluaciones e ON e.profesor_id = p.id
      GROUP BY p.id, p.nombre, p.curso
      ORDER BY calificacion_promedio DESC, p.nombre ASC
    `);

    const response = {
      ok:true,
      general: {
        total_respuestas: Number(generalRows[0].total_respuestas || 0),
        promedio_general: generalRows[0].promedio_general!==null ? Number(generalRows[0].promedio_general) : 0
      },
      por_profesor: porProfesor.map(r => ({
        profesor_id: r.profesor_id,
        nombre: r.nombre,
        curso: r.curso,
        cantidad_respuestas: Number(r.cantidad_respuestas),
        calificacion_promedio: Number(r.calificacion_promedio)
      }))
    };

    if(profesor_id){
     const [detalle] = await pool.query(`
  SELECT
    p.id AS profesor_id,
    p.nombre,
    p.curso,
    COUNT(e.id) AS cantidad_respuestas,
    ROUND(AVG(e.q1),2) AS q1_prom,
    ROUND(AVG(e.q2),2) AS q2_prom,
    ROUND(AVG(e.q3),2) AS q3_prom,
    ROUND(AVG(e.q4),2) AS q4_prom,
    ROUND(AVG(e.q5),2) AS q5_prom,
    ROUND(AVG((e.q1+e.q2+e.q3+e.q4+e.q5)/5),2) AS promedio
  FROM profesores p
  LEFT JOIN evaluaciones e ON e.profesor_id = p.id
  WHERE p.id = ?
  GROUP BY p.id, p.nombre, p.curso
`, [profesor_id]);

      response.detalle_profesor = detalle[0] || null;
    }

    res.json(response);
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, message:'Error al calcular estadísticas' });
  }
});

export default router;
