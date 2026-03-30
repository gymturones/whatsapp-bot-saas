import React from 'react';
import { Card, Badge, Button } from './UI';

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

export const BotCard: React.FC<BotCardProps> = ({
  bot,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
          {bot.description && (
            <p className="text-sm text-gray-600 mt-1">{bot.description}</p>
          )}
        </div>
        <Badge variant={bot.is_active ? 'success' : 'warning'}>
          {bot.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {bot.message_count && (
          <p>📨 {bot.message_count} mensajes</p>
        )}
        {bot.created_at && (
          <p>📅 {new Date(bot.created_at).toLocaleDateString('es-AR')}</p>
        )}
      </div>

      <div className="flex gap-2">
        {onView && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onView(bot.id)}
          >
            Ver
          </Button>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(bot.id)}
          >
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(bot.id)}
          >
            Eliminar
          </Button>
        )}
      </div>
    </Card>
  );
};

// Conversation List Item
interface ConversationItemProps {
  conversation: {
    id: string;
    phone_number: string;
    customer_name?: string;
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
  };
  onClick?: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick?.(conversation.id)}
      className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {conversation.customer_name || conversation.phone_number}
          </h4>
          {conversation.last_message && (
            <p className="text-sm text-gray-600 mt-1 truncate">
              {conversation.last_message}
            </p>
          )}
        </div>
        {conversation.unread_count && conversation.unread_count > 0 && (
          <Badge variant="info">{conversation.unread_count}</Badge>
        )}
      </div>
      {conversation.last_message_at && (
        <p className="text-xs text-gray-500 mt-2">
          {new Date(conversation.last_message_at).toLocaleDateString('es-AR')}
        </p>
      )}
    </div>
  );
};

// Conversation List
interface ConversationListProps {
  conversations: ConversationItemProps['conversation'][];
  loading?: boolean;
  onSelectConversation?: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  onSelectConversation,
}) => {
  if (loading) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500">Cargando conversaciones...</p>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500">Sin conversaciones</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={onSelectConversation}
        />
      ))}
    </Card>
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
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOutgoing
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOutgoing ? 'text-blue-100' : 'text-gray-600'}`}>
          {new Date(message.created_at).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
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

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  loading,
}) => {
  return (
    <Card className="h-96 overflow-y-auto">
      {loading ? (
        <p className="text-center text-gray-500 py-8">Cargando mensajes...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Sin mensajes</p>
      ) : (
        <div className="p-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </Card>
  );
};

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

export const BotResponseItem: React.FC<BotResponseItemProps> = ({
  response,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <Badge variant="info">Palabra clave: {response.trigger_keyword}</Badge>
          <p className="text-sm text-gray-600 mt-2">{response.response_text}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {onEdit && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(response.id)}
          >
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(response.id)}
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  );
};

// Stats Card
interface StatsCardProps {
  label: string;
  value: number | string;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  icon,
}) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.direction === 'up' ? '↑' : '↓'} {change.value}% vs. semana anterior
            </p>
          )}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </Card>
  );
};

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

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
  return (
    <Card
      className={`flex flex-col h-full ${
        plan.popular
          ? 'ring-2 ring-blue-600 transform scale-105'
          : ''
      }`}
    >
      {plan.popular && (
        <Badge variant="info" className="w-fit mb-3">
          Popular
        </Badge>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-600">/mes</span>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-green-600">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        variant={plan.popular ? 'primary' : 'secondary'}
        className="w-full"
      >
        Elegir Plan
      </Button>
    </Card>
  );
};
