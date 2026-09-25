import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Check } from 'lucide-react';
import { createLead } from '../lib/storage';
import { Input, Textarea, Button } from '../components/ui';

export function ContatoPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      mensagem: formData.mensagem,
      origem: 'site',
      status: 'novo',
    });
    setEnviado(true);
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Entre em Contato</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Estamos prontos para ajudar você a encontrar o imóvel ideal. 
          Preencha o formulário ou use um dos nossos canais de atendimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações de contato */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">(11) 3456-7890</p>
                  <p className="text-sm text-gray-600">(11) 99999-8888 (WhatsApp)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">contato@imob.com.br</p>
                  <p className="text-sm text-gray-600">vendas@imob.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Av. Paulista, 1000 - 10º andar</p>
                  <p className="text-sm text-gray-600">Bela Vista, São Paulo/SP</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Seg a Sex: 9h às 18h</p>
                  <p className="text-sm text-gray-600">Sáb: 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-6 md:p-8">
            {enviado ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mensagem enviada com sucesso!</h3>
                <p className="text-gray-600 mb-6">
                  Obrigado pelo contato. Nossa equipe retornará em até 24 horas úteis.
                </p>
                <Button onClick={() => setEnviado(false)} variant="secondary">
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Envie sua mensagem</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome completo"
                    required
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Input
                  label="Telefone"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
                <Textarea
                  label="Mensagem"
                  required
                  placeholder="Como podemos ajudar?"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                />
                <Button type="submit" size="lg">
                  Enviar mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
