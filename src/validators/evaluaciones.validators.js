import { body, validationResult } from 'express-validator';

export const createEvaluacionRules = [
  body('profesor_id').isInt({ min:1 }).withMessage('profesor_id inválido'),
  ...[1,2,3,4,5].map(n =>
    body(`q${n}`).isInt({ min:1, max:5 }).withMessage(`q${n} debe estar entre 1 y 5`)
  ),
  body('comentario').trim().notEmpty().withMessage('El comentario es obligatorio')
];

export function validate(req,res,next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ ok:false, message:'Validación fallida', errors: errors.array() });
  }
  next();
}
