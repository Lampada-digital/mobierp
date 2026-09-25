import { Imovel } from '../types';
import { formatarPreco, formatarArea, labelTipo, labelFinalidade } from '../lib/utils';
import { Card, Badge } from './ui';
import { MapPin, Bed, Bath, Car, Maximize, ArrowRight } from 'lucide-react';

interface ImovelCardProps {
  imovel: Imovel;
  onClick?: () => void;
  featured?: boolean;
}

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  disponivel: { label: 'Disponível', variant: 'success' },
  reservado: { label: 'Reservado', variant: 'warning' },
  vendido: { label: 'Vendido', variant: 'danger' },
  alugado: { label: 'Alugado', variant: 'info' },
};

export function ImovelCard({ imovel, onClick, featured = false }: ImovelCardProps) {
  const fotoPrincipal = imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';
  const status = statusMap[imovel.status] || { label: imovel.status, variant: 'neutral' as const };

  return (
    <Card
      onClick={onClick}
      padding="none"
      className="group overflow-hidden"
    >
      {/* Imagem com aspect-ratio fixo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={fotoPrincipal}
          alt={imovel.titulo}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <Badge variant={status.variant} dot>
              {status.label}
            </Badge>
            <Badge variant="default">
              {labelFinalidade(imovel.finalidade)}
            </Badge>
          </div>
          {imovel.fotos.length > 1 && (
            <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
              📷 {imovel.fotos.length}
            </div>
          )}
        </div>

        {/* Preço flutuante */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm text-neutral-900 font-bold text-sm px-3 py-1.5 rounded-lg shadow-lg">
            {formatarPreco(imovel.preco, imovel.finalidade)}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            {labelTipo(imovel.tipo)}
          </p>
        </div>
        <h3 className="font-semibold text-neutral-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-700 transition-colors">
          {imovel.titulo}
        </h3>
        <div className="flex items-center text-sm text-neutral-500 mb-4">
          <MapPin size={13} className="mr-1 flex-shrink-0 text-neutral-400" />
          <span className="truncate">{imovel.bairro}, {imovel.cidade}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
          {imovel.quartos > 0 && (
            <div className="flex items-center gap-1" title="Quartos">
              <Bed size={13} className="text-neutral-400" />
              <span className="font-medium">{imovel.quartos}</span>
            </div>
          )}
          {imovel.banheiros > 0 && (
            <div className="flex items-center gap-1" title="Banheiros">
              <Bath size={13} className="text-neutral-400" />
              <span className="font-medium">{imovel.banheiros}</span>
            </div>
          )}
          {imovel.vagas > 0 && (
            <div className="flex items-center gap-1" title="Vagas">
              <Car size={13} className="text-neutral-400" />
              <span className="font-medium">{imovel.vagas}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto" title="Área">
            <Maximize size={13} className="text-neutral-400" />
            <span className="font-medium">{formatarArea(imovel.area)}</span>
          </div>
        </div>

        {/* CTA hover */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium text-brand-600 flex items-center gap-1">
            Ver detalhes <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Card>
  );
}

/* Skeleton para loading */
export function ImovelCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-3 w-32" />
        <div className="flex gap-3 pt-3 border-t border-neutral-100">
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-8" />
          <div className="skeleton h-4 w-12 ml-auto" />
        </div>
      </div>
    </div>
  );
}
