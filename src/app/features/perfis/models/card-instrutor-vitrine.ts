import { PerfilInstrutor } from './perfil-instrutor';

export type CardInstrutorVitrine = Pick<
  PerfilInstrutor,
  | 'id'
  | 'nomeCompleto'
  | 'fotoPerfilUrl'
  | 'avaliacaoMedia'
  | 'totalAvaliacoes'
  | 'categoriasAtendidas'
  | 'valorHora'
> & {
  bairroRegiao: string;
};
