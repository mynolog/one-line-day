chrome.runtime.onInstalled.addListener(() => {
  const now = new Date()

  const KST_OFFSET = 9 // KST는 UTC+9
  const nextKST2_10PM_UTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      22 - KST_OFFSET,
      0,
      0,
      0
    )
  )

  if (now.getTime() > nextKST2_10PM_UTC.getTime()) {
    nextKST2_10PM_UTC.setUTCDate(nextKST2_10PM_UTC.getUTCDate() + 1)
  }

  chrome.alarms.create('dailyReminder', {
    when: nextKST2_10PM_UTC.getTime(),
    periodInMinutes: 24 * 60,
  })

  console.log('Alarm scheduled for (UTC):', nextKST2_10PM_UTC.toISOString())
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReminder') {
    chrome.notifications.create(
      'dailyReminderId',
      {
        type: 'basic',
        iconUrl: 'icon-96x96.png',
        title: '📝 오늘 하루 회고를 남겨보세요!',
        message: '간단한 한 줄 회고로 오늘을 돌아보세요.',
        priority: 2,
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error('Notification error:', chrome.runtime.lastError.message)
        } else {
          console.log('Notification shown with ID:', notificationId)
        }
      }
    )
  }
})
