const templates = {
  en: {
    booking_confirmation: ({ busId, date }) => ({
      title: 'Booking Confirmed',
      message: `Your booking for bus ${busId} is confirmed${date ? ` on ${date}` : ''}.`
    }),
    booking_cancellation: ({ busId, reason }) => ({
      title: 'Booking Cancelled',
      message: `Your booking for bus ${busId} has been cancelled${reason ? `: ${reason}` : '.'}`
    }),
    schedule_change: ({ busId, departureTime, arrivalTime, effectiveDate, note }) => ({
      title: 'Schedule Changed',
      message: `The schedule for bus ${busId} has been updated${effectiveDate ? ` for ${effectiveDate}` : ''}${departureTime ? `. New departure: ${departureTime}` : ''}${arrivalTime ? `, arrival: ${arrivalTime}` : ''}${note ? `. Note: ${note}` : ''}.`
    }),
    journey_reminder: ({ busId, date }) => ({
      title: 'Journey Reminder',
      message: `Reminder: your trip for bus ${busId} is scheduled${date ? ` on ${date}` : ' soon'}.`
    }),
    promotion: ({ offerTitle }) => ({
      title: 'New Offer',
      message: offerTitle || 'A new promotional offer is available for you.'
    }),
    general: ({ message, title }) => ({
      title: title || 'Notification',
      message: message || 'You have a new notification.'
    })
  },
  hi: {
    booking_confirmation: ({ busId, date }) => ({
      title: 'Booking Confirmed',
      message: `Aapki bus ${busId} ki booking${date ? ` ${date}` : ''} ke liye confirm ho gayi hai.`
    }),
    booking_cancellation: ({ busId, reason }) => ({
      title: 'Booking Cancelled',
      message: `Aapki bus ${busId} ki booking cancel ho gayi hai${reason ? `: ${reason}` : '.'}`
    }),
    schedule_change: ({ busId, departureTime, arrivalTime, effectiveDate, note }) => ({
      title: 'Schedule Changed',
      message: `Bus ${busId} ka schedule update hua hai${effectiveDate ? `, date ${effectiveDate}` : ''}${departureTime ? `. Naya departure time: ${departureTime}` : ''}${arrivalTime ? `, arrival time: ${arrivalTime}` : ''}${note ? `. Note: ${note}` : ''}.`
    }),
    journey_reminder: ({ busId, date }) => ({
      title: 'Journey Reminder',
      message: `Yaad rahe: aapki bus ${busId} ki journey${date ? ` ${date}` : ''} ke liye scheduled hai.`
    }),
    promotion: ({ offerTitle }) => ({
      title: 'New Offer',
      message: offerTitle || 'Aapke liye ek naya promotional offer available hai.'
    }),
    general: ({ message, title }) => ({
      title: title || 'Notification',
      message: message || 'Aapke liye ek nayi notification hai.'
    })
  }
};

function resolveNotificationContent(locale = 'en', type = 'general', metadata = {}, fallback = {}) {
  const localeTemplates = templates[locale] || templates.en;
  const factory = localeTemplates[type] || localeTemplates.general;
  return factory({
    ...metadata,
    title: fallback.title,
    message: fallback.message
  });
}

module.exports = {
  resolveNotificationContent
};
