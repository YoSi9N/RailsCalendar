Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, only:[:show, :create]
  resources :groups, only:[:new, :create, :update, :destroy] do
    resources :events, only: [:index]
  end
  resources :events, only:[:create, :update, :destroy]
  root "users#show"

end
