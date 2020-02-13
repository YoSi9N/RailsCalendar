class LinebotController < ApplicationController
  protect_from_forgery
  require 'line/bot'

  def callback
    body = request.body.read
    signature = request.env['HTTP_X_LINE_SIGNATURE']
    unless client.validate_signature(body, signature)
      error 400 do 'Bad Request' end
    end
    events = client.parse_events_from(body)

    events.each do |event|
      case event
      when Line::Bot::Event::Message
        case event.type
        when Line::Bot::Event::MessageType::Text
          if User.find_by(name: event.message['text']).present?
            user = User.find_by(name: event.message['text'])
            events = Event.where(user_id: user.id).order("start ASC")
            start = ""
            events.each do |event|
              if event.start < 1.day.since && event.start >= DateTime.now
                if event.title.present?
                  push = "#{event.start.strftime("%-m月%-d日 %H:%M")}\n#{event.title}\n"
                else
                  push = "#{event.start.strftime("%-m月%-d日 %H:%M")}\n"
                end
                start = start + push
              end
            end
            if start == ""
              message = {
              type: 'text',
              text: "#{user.name}さんの今日の予定はありません！"
              }
            else
              message = {
                type: 'text',
                text: "#{user.name}さんの24時間の予定は\n#{start}の予定になっています。"
              }
            end
          else
            message = {
              type: 'text',
              text: "ユーザーが見つかりませんでした！\n正しいニックネームの入力をお願いします！"
            }
          end
        end
      end
      client.reply_message(event['replyToken'], message)
    end
    head :ok
  end

private

# LINE Developers登録完了後に作成される環境変数の認証
  def client
    @client ||= Line::Bot::Client.new { |config|
      config.channel_secret = Rails.application.credentials[:LINE_CHANNEL_SECRET]
      config.channel_token = Rails.application.credentials[:LINE_CHANNEL_TOKEN]
    }
  end
end

