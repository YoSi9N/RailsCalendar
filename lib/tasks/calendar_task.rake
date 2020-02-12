namespace :calendar_task do
  desc "push_line"
  task push_line_message_morning: :environment do # 以下にpush機能のタスクを書く。
    message = {
      type: 'text',
      text: 'おはようございます！ AM 7:00です。今日の予定を確認されますか？'
    }
    client = Line::Bot::Client.new { |config|
      config.channel_secret = Rails.application.credentials[:LINE_CHANNEL_SECRET]
      config.channel_token = Rails.application.credentials[:LINE_CHANNEL_TOKEN]
    }
    response = client.push_message(Rails.application.credentials[:LINE_CHANNEL_USER_ID], message)
    p response
  end
end
