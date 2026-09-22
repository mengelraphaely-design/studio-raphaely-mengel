// Studio Raphaely Mengel - Gerador de mensagens e links diretos para WhatsApp
export const STUDIO_PHONE = '5579999000000'; // Telefone padrão de atendimento do Studio
export const STUDIO_NAME = 'Studio Raphaely Mengel';

export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function openWhatsApp(phone: string, message: string) {
  const clean = cleanPhone(phone);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${clean}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// 1. Mensagem para cliente agendar novo procedimento
export function getBookingWhatsAppMessage(procedureName: string, clientName?: string, datePreference?: string) {
  return `Olá, Rapha! ✨ Vi o seu site e gostaria de agendar um horário para *${procedureName}*${clientName ? ` (Sou ${clientName})` : ''}.${datePreference ? ` Minha preferência de data/horário seria: ${datePreference}.` : ''} Como está a sua disponibilidade?`;
}

// 2. Mensagem de Lembrete / Confirmação de 24h enviado pela Rapha
export function getReminderWhatsAppMessage(clientName: string, procedureName: string, dateStr: string, timeStr: string) {
  return `Olá, ${clientName}! ✨ Tudo bem, linda?\n\nPassando para confirmar seu horário amanhã no *Studio Raphaely Mengel*:\n\n🗓 *Data:* ${dateStr}\n⏰ *Horário:* ${timeStr}\n💆‍♀️ *Procedimento:* ${procedureName}\n📍 *Local:* Av. Beira Mar, Aracaju - SE\n\nPodemos confirmar sua presença? Se precisar de alguma orientação antes da sessão, é só me avisar! ❤️`;
}

// 3. Mensagem de Aniversário com Bonificação / Mimo
export function getBirthdayBonusWhatsAppMessage(clientName: string, bonusDescription: string = 'R$ 50 de desconto ou um Spa Labial de cortesia') {
  return `Parabéns pelo seu dia, ${clientName}! 🎂✨💐\n\nAqui é a Rapha do Studio Raphaely Mengel. Desejo muita luz, saúde, beleza e momentos especiais na sua vida!\n\nE claro, preparamos um presente especial para celebrar com você: você ganhou *${bonusDescription}* no seu próximo procedimento durante todo este seu mês de aniversário! 🎁✨\n\nVamos agendar um momento só seu de autocuidado? Me avise quando quer vir! 💕`;
}

// 4. Mensagem de Retenção / Saudade para clientes sumidas (30-60+ dias)
export function getRetentionMimoWhatsAppMessage(clientName: string, lastProcedure: string, daysAgo: number) {
  return `Oi, ${clientName}! Quanta saudade de você por aqui! 🥰✨\n\nPercebi que já faz ${daysAgo} dias desde sua última sessão de *${lastProcedure}*. A sua pele e o seu bem-estar merecem aquele momento de pausa e renovação!\n\nPreparei um *mimo exclusivo de retorno* para você nesta semana: agendando seu retorno agora, você ganha uma Hidratação Facial Ultrassônica de presente! 💆‍♀️🌸\n\nQual dia fica melhor para você tirar um tempinho para si mesma?`;
}
