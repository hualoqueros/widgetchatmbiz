console.log("HAS LOADED");

class ChatWidget {
    constructor( element, options ){
        
        this.target             = element;
        this.entity_id          = this.target.getAttribute("data-id");
        this.companySellerId    = this.target.getAttribute("data-company-seller-id");
        this.companyBuyerId     = this.target.getAttribute("data-company-buyer-id");
        this.sellerName         = this.target.getAttribute("data-seller-name");
        this.url                = this.target.getAttribute("url");
        this.widgetUrl          = options.widget_url;
        this.entity_name        = options.entity_name || "contact_us";
        this.pov                = options.pov || "buyer";
        this.token              = options.token;
        this.auto_create        = options.auto_create || true;
        this.classWrapper       = document.getElementsByClassName("targetChat")[0];
        this.receiverName       = "";
        this.senderName         = "";
        
        if (this.pov=="buyer") {
            this.receiver_url   = "/detiltoko?tokoid=" + this.companySellerId;
            this.receiverName   = this.sellerName;
        }else{
            this.receiver_url   = "#";
            this.receiverName   = this.sellerName;
        }
    }

    setHeader(){
        var headerReceiverName          = document.getElementsByClassName('chat-receiver-name')[0];
        headerReceiverName.innerHTML    = this.receiverName;
        headerReceiverName.href         = this.receiver_url;
    }

    setContent(){
        var construct = this;

        // check is already rendered
        var existingIframe = document.getElementById('chat-iframe-' + construct.companySellerId);
        
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
            entity_id: this.entity_id,
            company_buyer_id : this.companyBuyerId,
            company_seller_id: this.companySellerId,
            company_seller_name: this.sellerName,
            auto_create: false
        };

        $.ajax({
            type: 'POST',
            url:this.url,
            headers: {
                token: this.token
            },
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType:"json",
            success: function (data) {


                var chatIframes =  document.getElementsByClassName("chat-iframe");
                for(var i=0; i < chatIframes.length; i++){
                    chatIframes[i].style.display = "none";
                }
                
                var widget_params = {
                    token: data.token,
                    // product_name : $('.product-title').text(),
                    // tier_prices: tp,
                    // prod_img: prod_img,
                    // prod_link: window.location.href
                };
                var selector        = document.getElementsByClassName("chat-room_chat")[0];
                var iframe          = selector.appendChild( document.createElement("iframe") );
                iframe.src          = construct.widgetUrl + '&token=' + data.token;
                iframe.id           = 'chat-iframe-' + construct.companySellerId;
                iframe.classList.add("chat-iframe");
                iframe.style.display = "block";
            },
            failure: function (errMsg) {
                alert(errMsg)
            }
        });
    }

    generate() {

        this.setHeader();
        this.setContent();
        
        return this;
    }
}

module.exports = ChatWidget
