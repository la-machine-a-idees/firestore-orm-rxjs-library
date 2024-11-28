import { z } from 'zod'; 

export const oneReference = z.string().optional();
export const multipleReferences = z.array(z.string()).optional();
