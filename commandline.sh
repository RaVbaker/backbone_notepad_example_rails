#!/usr/bin/env bash

# tworzymy aplikację: (bez Prototype jak już ustaliliśmy)
rails new example_notepad_app -J 
cd example_notepad_app                                  

# dodajemy obsluge jQuery (via: https://github.com/rails/jquery-ujs/blob/master/README.md ):
echo "gem 'jquery-rails', '>= 0.2.6'" >> Gemfile

#instalujemy potrzebne gemy:                          
bundle install              
                             
# dodajemy jquery do aplikacji (z obsługą jQuery-UI)
rails generate jquery:install --ui
                                                                                                  
# ściagamy backbone i underscore oraz json2.js (pamietac, ze github używa https i pomijamy check certyfikatu: --no-check-certificate)                                                   
wget http://documentcloud.github.com/underscore/underscore-min.js -Opublic/javascripts/underscore.min.js
wget http://documentcloud.github.com/backbone/backbone-min.js -Opublic/javascripts/backbone.min.js
wget https://github.com/douglascrockford/JSON-js/raw/master/json2.js -Opublic/javascripts/json2.js --no-check-certificate      
                                       
# konfigurujemy to_json na modelach aby było zgodne z formatem backbone'a:
echo "ActiveRecord::Base.include_root_in_json = false" > config/initializers/ar_json_no_root.rb 

# w config/application.rb zmieniamy domyślny javascript[:defaults] na:
# config.action_view.javascript_expansions[:defaults] = %w(jquery.min underscore.min json2 backbone.min) aby używać jquery, backbone i underscore   
sed -i '' '/config\.action_view\.javascript_expansions\[:defaults\]/s/\%w()/\%w(jquery.min jquery-ui.min underscore.min json2 backbone.min)/' config/application.rb

# scaffold dla zasobu:
rails generate scaffold note title:string author:string content:text
                             
# edytujemy pliki: config/routes.rm dodając: resources :notes, :format => :json, aby domyślny format był JSONem - potrzebny do transferu danych do/z backbone'a:
sed -i '' '/resources :notes/s/$/, :format => :json/' config/routes.rb

# edytujemy app/controllers/notes_controller.rb i podmieniamy xml na json
sed -i ''  's/xml/json/g'  app/controllers/notes_controller.rb

# twrzymy baze i migrujemy...              
rake db:create
rake db:migrate
              
# usuwamy domyslny szablon strony głównej:
rm public/index.html

# tworzymy kontroler dla strony frotendowej
rails generate controller notepad index

# konfigurujemy aby strona główna odwoływała się do kontrolera notepad:
sed -i '' '/root :to/s/# root :to => "welcome#index"/root :to => "notepad#index"/' config/routes.rb        


# zaczynamy kodowanie:
# upraszczamy i piszemy cały kod w public/javascripts/application.js
