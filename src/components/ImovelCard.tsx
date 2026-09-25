import { Imovel } from '../types';
import { formatarPreco, formatarArea, labelTipo, labelFinalidade, corStatusImovel, labelStatusImovel } from '../lib/utils';
import { Card, Badge } from './ui';
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react';

interface ImovelCardProps {
  imovel: Imovel;
  onClick?: () => void;
}

export function ImovelCard({ imovel, onClick }: ImovelCardProps) {
  const fotoPrincipal = imovel.fotos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';

  return (
    <Card onClick={onClick} className="group">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={fotoPrincipal}
          alt={imovel.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-blue-600 text-white">
            {labelFinalidade(imovel.finalidade)}
          </Badge>
          <Badge className={corStatusImovel(imovel.status)}>
            {labelStatusImovel(imovel.status)}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-white/90 text-gray-900 font-semibold text-sm backdrop-blur-sm">
            {formatarPreco(imovel.preco, imovel.finalidade)}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {labelTipo(imovel.tipo)}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{imovel.titulo}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{imovel.bairro}, {imovel.cidade}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
          {imovel.quartos > 0 && (
            <div className="flex items-center gap-1">
              <Bed size={14} />
              <span>{imovel.quartos}</span>
            </div>
          )}
          {imovel.banheiros > 0 && (
            <div className="flex items-center gap-1">
              <Bath size={14} />
              <span>{imovel.banheiros}</span>
            </div>
          )}
          {imovel.vagas > 0 && (
            <div className="flex items-center gap-1">
              <Car size={14} />
              <span>{imovel.vagas}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize size={14} />
            <span>{formatarArea(imovel.area)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
