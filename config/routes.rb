Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :events, only:[:index, :create, :update, :destroy]
  root "events#index"
end
