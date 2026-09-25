import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Check, Send } from 'lucide-react';
import { createLead } from '../lib/storage';
import { Input, Textarea, Button, Card } from '../components/ui';

export function ContatoPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      createLead({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        mensagem: formData.mensagem,
        origem: 'site',
        status: 'novo',
      });
      setEnviado(true);
      setEnviando(false);
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Contato</p>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 font-display text-balance mb-4">
          Estamos prontos para ajudar você
        </h1>
        <p className="text-neutral-600 leading-relaxed">
          Preencha o formulário ou use um dos nossos canais de atendimento. 
          Nossa equipe retornará em até 24 horas úteis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Informações de contato */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-neutral-900 mb-5 font-display text-lg">Informações</h3>
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Telefone', value: '(11) 3456-7890', extra: '(11) 99999-8888 (WhatsApp)' },
                { icon: Mail, label: 'Email', value: 'contato@imob.com.br', extra: 'vendas@imob.com.br' },
                { icon: MapPin, label: 'Endereço', value: 'Av. Paulista, 1000 - 10º andar', extra: 'Bela Vista, São Paulo/SP' },
                { icon: Clock, label: 'Horário', value: 'Seg a Sex: 9h às 18h', extra: 'Sáb: 9h às 13h' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-neutral-900 text-sm mt-0.5">{item.value}</p>
                    {item.extra && <p className="text-xs text-neutral-500 mt-0.5">{item.extra}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Redes sociais */}
          <Card>
            <h3 className="font-bold text-neutral-900 mb-3 font-display text-sm">Redes Sociais</h3>
            <div className="flex gap-2">
              {['Instagram', 'Facebook', 'LinkedIn'].map((rede) => (
                <a
                  key={rede}
                  href="#"
                  className="flex-1 py-2 text-center text-xs font-medium bg-neutral-50 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                >
                  {rede}
                </a>
              ))}
            </div>
          </Card>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            {enviado ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2 font-display">Mensagem enviada!</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Obrigado pelo contato. Nossa equipe retornará em até 24 horas úteis.
                </p>
                <Button variant="outline" onClick={() => setEnviado(false)}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg mb-1 font-display">Envie sua mensagem</h3>
                  <p className="text-sm text-neutral-500">Preencha os campos abaixo e entraremos em contato.</p>
                </div>
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
                <Button type="submit" size="lg" loading={enviando} icon={<Send size={16} />}>
                  Enviar mensagem
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
