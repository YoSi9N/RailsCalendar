Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, only:[:index ,:show, :create]
  resources :groups, only:[:new, :create, :edit, :update, :destroy] do
    resources :events, only: [:index]
  end
  resources :events, only:[:create, :update, :destroy]
  post '/callback' => 'linebot#callback'
  root "users#show"
end
