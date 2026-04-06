import React from 'react';
import { Badge, Button } from './UI';

// Bot Card
interface BotCardProps {
  bot: {
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
    message_count?: number;
    created_at?: string;
  };
  onEdit?: (botId: string) => void;
  onDelete?: (botId: string) => void;
  onView?: (botId: string) => void;
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onEdit, onDelete, onView }) => (
  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 p-6 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-white truncate">{bot.name}</h3>
        {bot.description && (
          <p className="text-sm text-slate-500 mt-0.5 truncate">{bot.description}</p>
        )}
      </div>
      <Badge variant={bot.is_active ? 'success' : 'warning'}>
        {bot.is_active ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>

    <div className="space-y-1 mb-5 text-xs text-slate-500">
      {bot.message_count !== undefined && (
        <p>{bot.message_count} mensajes</p>
      )}
      {bot.created_at && (
        <p>{new Date(bot.created_at).toLocaleDateString('es-AR')}</p>
      )}
    </div>

    <div className="flex gap-2">
      {onView && (
        <Button size="sm" variant="primary" onClick={() => onView(bot.id)}>Ver</Button>
      )}
      {onEdit && (
        <Button size="sm" variant="secondary" onClick={() => onEdit(bot.id)}>Editar</Button>
      )}
      {onDelete && (
        <Button size="sm" variant="danger" onClick={() => onDelete(bot.id)}>Eliminar</Button>
      )}
    </div>
  </div>
);

// Conversation List Item
interface ConversationItemProps {
  conversation: {
    id: string;
    phone_number?: string;
    whatsapp_contact?: string;
    customer_name?: string;
    contact_name?: string;
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
  };
  onClick?: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick }) => {
  const name = conversation.contact_name || conversation.customer_name ||
               conversation.whatsapp_contact || conversation.phone_number || 'Contacto';

  return (
    <div
      onClick={() => onClick?.(conversation.id)}
      className="p-4 border-b border-slate-800/60 hover:bg-slate-800/30 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm truncate">{name}</h4>
          {conversation.last_message && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{conversation.last_message}</p>
          )}
        </div>
        {conversation.unread_count && conversation.unread_count > 0 && (
          <Badge variant="info">{conversation.unread_count}</Badge>
        )}
      </div>
      {conversation.last_message_at && (
        <p className="text-xs text-slate-600 mt-1">
          {new Date(conversation.last_message_at).toLocaleDateString('es-AR')}
        </p>
      )}
    </div>
  );
};

// Message Item
interface MessageItemProps {
  message: {
    id: string;
    content: string;
    direction: 'incoming' | 'outgoing';
    created_at: string;
  };
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isOutgoing = message.direction === 'outgoing';

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
        isOutgoing
          ? 'bg-green-500 text-white rounded-br-none'
          : 'bg-slate-800 text-slate-200 rounded-bl-none'
      }`}>
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${isOutgoing ? 'text-green-100' : 'text-slate-500'}`}>
          {new Date(message.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// Message Thread
interface MessageThreadProps {
  messages: MessageItemProps['message'][];
  loading?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ messages, loading }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-96 overflow-y-auto p-4">
    {loading ? (
      <p className="text-center text-slate-500 py-8 text-sm">Cargando mensajes...</p>
    ) : messages.length === 0 ? (
      <p className="text-center text-slate-500 py-8 text-sm">Sin mensajes</p>
    ) : (
      messages.map((message) => <MessageItem key={message.id} message={message} />)
    )}
  </div>
);

// Stats Card
interface StatsCardProps {
  label: string;
  value: number | string;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, icon }) => (
  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
        {change && (
          <p className={`text-xs mt-1 ${change.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {change.direction === 'up' ? '↑' : '↓'} {change.value}%
          </p>
        )}
      </div>
      {icon && <span className="text-2xl opacity-60">{icon}</span>}
    </div>
  </div>
);

// Bot Response Item
interface BotResponseItemProps {
  response: {
    id: string;
    trigger_keyword: string;
    response_text: string;
    order: number;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const BotResponseItem: React.FC<BotResponseItemProps> = ({ response, onEdit, onDelete }) => (
  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="mb-3">
      <Badge variant="info">Palabra clave: {response.trigger_keyword}</Badge>
      <p className="text-sm text-slate-400 mt-2">{response.response_text}</p>
    </div>
    <div className="flex gap-2">
      {onEdit && <Button size="sm" variant="secondary" onClick={() => onEdit(response.id)}>Editar</Button>}
      {onDelete && <Button size="sm" variant="danger" onClick={() => onDelete(response.id)}>Eliminar</Button>}
    </div>
  </div>
);

// Pricing Card
interface PricingCardProps {
  plan: {
    name: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
  };
  onSelect?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => (
  <div className={`flex flex-col h-full rounded-2xl p-6 border ${
    plan.popular
      ? 'bg-green-500/10 border-green-500/30 shadow-xl shadow-green-500/10'
      : 'bg-slate-900/60 border-slate-800'
  }`}>
    {plan.popular && <Badge variant="success" className="w-fit mb-3">Popular</Badge>}
    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
    <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
    <div className="mb-6">
      <span className="text-4xl font-black text-white">${plan.price}</span>
      <span className="text-slate-500">/mes</span>
    </div>
    <ul className="flex-1 space-y-2.5 mb-6">
      {plan.features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
          <span className="text-green-400">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <Button onClick={onSelect} variant={plan.popular ? 'primary' : 'secondary'} className="w-full">
      Elegir Plan
    </Button>
  </div>
);
