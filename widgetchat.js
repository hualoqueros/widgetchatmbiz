class ChatWidget {
    constructor( element, options ){
        
        this.widgetUrl          = options.widget_url;
        this.entity_name        = options.entity_name || "contact_us";
        this.pov                = options.pov || "buyer";
        this.token              = options.token;
        this.auto_create        = options.auto_create || true;

        this.elementWrapper     = document.getElementsByClassName( options.wrapper )[0];
        
        this.target             = element;
        this.entity_id          = this.target.getAttribute("data-id");
        this.companySellerId    = this.target.getAttribute("data-company-seller-id");
        this.companyBuyerId     = this.target.getAttribute("data-company-buyer-id");
        this.sellerName         = this.target.getAttribute("data-seller-name");
        this.url                = this.target.getAttribute("url");
        this.classWrapper       = document.getElementsByClassName("targetChat")[0];
        this.receiverName       = "";
        this.senderName         = "";
        this.room_id            = this.target.getAttribute("data-room-id");
        
        if (this.pov=="buyer") {
            this.receiver_url   = "/detiltoko?tokoid=" + this.companySellerId;
            this.receiverName   = this.sellerName;
        }else{
            this.receiver_url   = "#";
            this.receiverName   = this.sellerName;
        }

        this.wrapperIframe = "";

        this.targetChatContractual = "";
        var joinChatButton = document.createElement("button");
        this.buttonJoin = joinChatButton;
        
    }

    setHeader(){
        // var headerReceiverName          = document.getElementsByClassName('chat-receiver-name')[0];
        // headerReceiverName.innerHTML    = this.receiverName;
        // headerReceiverName.href         = this.receiver_url;
    }

    setWrapper(){
            // creating wrapper
            var targetChat_contractual = document.createElement("div");
            targetChat_contractual.classList.add("targetChat_contractual");
            this.targetChatContractual = targetChat_contractual;
            
            var chatRoom = document.createElement("div")
            chatRoom.classList.add("chat-room_chat");

            this.wrapperIframe = chatRoom;
            
            var chatInfo = document.createElement("div")
            chatInfo.classList.add("chat-info_chat");
            
            /* S:CHAT HEADER */
            var chatHeader = document.createElement("div");
            chatHeader.classList.add("chat-header");
            
            var mediaClearfix = document.createElement("div");
            mediaClearfix.classList.add("media");
            
            /* S:MEDIA BODY */
            var mediaBody = document.createElement("div");
            mediaBody.classList.add("media-body");

            var chatStoreSeller = document.createElement("span");
            chatStoreSeller.classList.add("chat-store_seller");

            var chatSellerProfile = document.createElement("a");
            chatSellerProfile.id = "chat-seller-profile";
            chatSellerProfile.innerHTML = this.receiverName;
            chatSellerProfile.classList.add("chat-seller-name");
            
            chatStoreSeller.appendChild( chatSellerProfile );

            var chatTitle = document.createElement("h4");
            chatTitle.classList.add("chat-title");
            
            chatTitle.textContent = "Diskusi Ajuan Kontrak";

            mediaBody.appendChild( chatTitle );

            mediaBody.appendChild( chatStoreSeller );
            /* E:MEDIA BODY */

            var chatLogo = document.createElement("a");
            chatLogo.classList.add("chat-logo_buyer");
            chatLogo.href = "#";

            var chatIcon = document.createElement("i");
            chatIcon.classList.add("fas") ;
            chatIcon.classList.add("fa-comments") ;

            chatLogo.appendChild( chatIcon );
            
            var closeButton = document.createElement("button");
            closeButton.classList.add("close-chat");
            closeButton.type = "button";

            
            var closeIcon = document.createElement("i");
            closeIcon.classList.add("fas");
            closeIcon.classList.add("fa-times");
            
            mediaClearfix.appendChild( chatLogo );

            mediaClearfix.appendChild( mediaBody );
            
            closeButton.appendChild(closeIcon);
            
            mediaClearfix.appendChild( closeButton );
            
            chatHeader.appendChild( mediaClearfix );
            /* E:CHAT HEADER */
            
            chatInfo.appendChild( chatHeader );
            
            var alertInfo = document.createElement("div");
            alertInfo.classList.add("alert");
            alertInfo.classList.add("alert-primary");
            
            var alertInfoIcon = document.createElement("i");
            alertInfoIcon.classList.add("fas");
            alertInfoIcon.classList.add("fa-exclamation-circle");
            
            alertInfo.innerHTML = "Lakukan diskusi mengenai Ajuan Kontrak hanya pada kolom Detail Ajuan Kontrak, pelajari lebih lanjut mengenai <a href='/kontraktual/terms'>Syarat &amp; Ketentuan Kontrak</a>";
            
            alertInfo.prepend( alertInfoIcon );
            
            chatInfo.appendChild( alertInfo );
            chatRoom.appendChild( chatInfo );
            
            targetChat_contractual.appendChild(
                chatRoom
            )
            
            
            // append to global wrapper
            this.elementWrapper.appendChild( targetChat_contractual );


            closeButton.onclick = function (){
                targetChat_contractual.remove();
            }
        
    }

    setContent(){
        var construct = this;

        // check is already rendered
        var existingIframe = document.getElementById('chat-iframe-' + construct.room_id);
        
        if ( existingIframe ) {
            var chatIframes =  document.getElementsByClassName("chat-iframe");
            for(var i=0; i < chatIframes.length; i++){
                chatIframes[i].style.display = "none";
            }
            existingIframe.style.display = "block";
            return this;
        }
        
        var data ={
            entity_name: this.entity_name,
            entity_id: this.entity_id || 1,
            company_buyer_id : this.companyBuyerId || 1,
            company_seller_id: this.companySellerId || 1,
            company_seller_name: this.sellerName || "samudra",
            auto_create: false
        };


        this.requestHTTPAsync( {
            method: 'POST',
            body: data,
            url: this.url
        }, (status, resp)=> {
            
            if(status == 200) {
                var data = JSON.parse(resp);
                
                var chatIframe =  document.createElement("iframe");
                chatIframe.src = construct.widgetUrl + '&token=' + data.token;
                chatIframe.id  = 'chat-iframe-' + construct.room_id;
                chatIframe.classList.add("chat-iframe");
                chatIframe.style.display = "block";
                
                this.wrapperIframe.appendChild(chatIframe);

                // Append join button if is_participant == false
                if (!data.is_participant) {
                    var joinChatDiv = document.createElement("div");
                    joinChatDiv.className = "chat-join_button";

                    
                    construct.buttonJoin.className = "btn btn-primary btn-sm";
                    construct.buttonJoin.innerHTML = "Gabung ke Percakapan";
                    construct.buttonJoin.setAttribute("data-entity-id", construct.entity_id);
                    construct.buttonJoin.setAttribute("data-entity-name", construct.entity_name);
                    construct.buttonJoin.setAttribute("data-entity-id", construct.entity_id);
                    construct.buttonJoin.setAttribute("data-entity-name", construct.entity_name);
                    construct.buttonJoin.setAttribute("data-room-id", construct.room_id);

                    // Insert buttonJoin into joinChatDiv
                    joinChatDiv.appendChild(construct.buttonJoin);

                    // append joinChatDiv into .chat-room_chat
                    this.wrapperIframe.appendChild(joinChatDiv);
                }
            }
        })
    }

    generate() {

        this.setHeader();
        this.setWrapper();
        this.setContent();
        
        return this;
    }

    requestHTTPAsync(options, callback){

        var http = new XMLHttpRequest();

        http.onreadystatechange = () =>{
            if (http.readyState == 4) {
                callback(http.status, http.responseText);
            }
        }
        
        http.open(options.method, options.url, true);
        http.setRequestHeader("token",this.token);
        http.setRequestHeader("Content-Type","application/json");
        http.send(JSON.stringify(options.body));
    }

    show(){
        this.targetChatContractual.style.display = "block";
    }

    hide(){
        this.targetChatContractual.style.display = "none";
    }

    joinListener( callback ){
        var construct = this;
        this.buttonJoin.onclick = function(){
            callback( construct.buttonJoin );
        }
    }
}

module.exports = ChatWidget
