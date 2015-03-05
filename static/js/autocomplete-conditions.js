$(function() {
        var conditions = [
          {
            id:1,
            name:'Acne'
          },
          {
            id:2,
            name:'Allergies',
            aliases: ['Rhinitis', 'Hay Fever']
          },
          {
            id:3,
            name:'Asthma'
          },
          {
            id:4,
            name:"Bell's palsy"
          },
          {
            id:5,
            name:'Benign Positional Vertigo'
          },
          {
            id:6,
            name:'Bunions'
          },
          {
            id:7,
            name:'Carpal Tunnel Syndrome'
          },
          {
            id:8,
            name:'Cataracts'
          },
          {
            id:9,
            name:'Coeliac Disease'
          },
          {
            id:11,
            name:'Congenital Blindness',
            aliases: ['Blind', 'Blindness']
          },
          {
            id:12,
            name:'Congenital Deafness',
          },
          {
            id:13,
            name:'Diabetes Mellitus (Types I &amp; II)',
          },
          {
            id:14,
            name:'Dry Eye Syndrome',
          },
          {
            id:15,
            name:'Epilepsy',
          },
          {
            id:16,
            name:'Folate Deficiency',
          },
          {
            id:17,
            name:'Gastric Reflux',
          },
          {
            id:18,
            name:'Glaucoma',
          },
          {
            id:19,
            name:'Goitre',
          },
          {
            id:20,
            name:'Graves&#39; Disease',
          },
          {
            id:21,
            name:'Hiatus Hernia',
          },
          {
            id:22,
            name:'Hypercholesterolaemia (High Cholesterol)',
          },
          {
            id:23,
            name:'Hyperlipidaemia (High Blood Lipids)',
          },
          {
            id:24,
            name:'Hypertension (High Blood Pressure)',
          },
          {
            id:25,
            name:'Hypothyroidism, including Hashimoto&#39;s Disease',
          }
          
        ];

        $('.condition')
          .autocomplete(conditions, {
            // Chris, uncomment the following line to make the instructions apepar
            // 'instructions': $("<div class='instructions'>Start typing to find condition</div>")
          })
          .bind('itemChosen', function(e, condition, textUserEntered, selectedListItem) {
            var tag = $('<div/>',{
              'class': 'radius label tag',
              'text': condition.name,
              
              
            });
            tag.append("<span class='fa fa-close'></span>");
            $('.tags').append(tag);
          });
        

        $('.tags').on('click', '.tag', function(e) {
          var tag = $(e.target);
          tag.remove();
        });
      });