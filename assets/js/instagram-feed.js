// Instagram Feed Configuration
const INSTAGRAM_CONFIG = {
    // Option 1: Using Instagram Basic Display API (requires setup)
    useApi: false,
    apiEndpoint: 'instagram-feed.php',
    accessToken: 'YOUR_ACCESS_TOKEN',
    userId: 'YOUR_USER_ID',
    
    // Option 2: Using third-party widget service (easier setup)
    useWidget: true,
    widgetType: 'snapwidget', // Options: 'snapwidget', 'lightwidget', 'elfsight'
    snapwidgetId: 'YOUR_SNAPWIDGET_ID',
    
    // Option 3: Manual fallback (static images with dynamic links)
    useFallback: true,
    instagramUsername: 'the_click_events',
    fallbackImages: [
        './assets/images/insta-section-img1.png',
        './assets/images/insta-section-img2.png', 
        './assets/images/insta-section-img3.png',
        './assets/images/insta-section-img4.png'
    ]
};

// Instagram Feed Manager
class InstagramFeedManager {
    constructor(config) {
        this.config = config;
        this.container = null;
    }
    
    async init() {
        this.container = document.querySelector('.insta-feed-container');
        if (!this.container) return;
        
        try {
            if (this.config.useApi && this.config.accessToken !== 'YOUR_ACCESS_TOKEN') {
                await this.loadFromAPI();
            } else if (this.config.useWidget && this.config.widgetType === 'snapwidget') {
                await this.loadSnapWidget();
            } else {
                this.loadFallback();
            }
        } catch (error) {
            console.log('Instagram feed failed, using fallback:', error);
            this.loadFallback();
        }
    }
    
    async loadFromAPI() {
        const response = await fetch(`${this.config.apiEndpoint}?action=get_feed`);
        const data = await response.json();
        
        if (data && data.data) {
            this.renderFeed(data.data);
        } else {
            throw new Error('Invalid API response');
        }
    }
    
    async loadSnapWidget() {
        if (this.config.snapwidgetId === 'YOUR_SNAPWIDGET_ID') {
            this.loadFallback();
            return;
        }
        
        const widgetHtml = `
            <iframe src="https://snapwidget.com/embed/${this.config.snapwidgetId}" 
                    class="snapwidget-widget" 
                    allowtransparency="true" 
                    frameborder="0" 
                    scrolling="no" 
                    style="border:none; overflow:hidden;  width:100%;">
            </iframe>
        `;
        
        this.container.innerHTML = widgetHtml;
    }
    
    loadFallback() {
        const feedHtml = `
            <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-6">
                    <figure class="mb-0 insta-section-imgs">
                        <img src="${this.config.fallbackImages[0]}" alt="Instagram Post 1" class="img-fluid">
                        <div class="hover_box_plus">
                            <a href="https://www.instagram.com/${this.config.instagramUsername}/" target="_blank" rel="noopener">
                                <i class="fa-brands fa-instagram"></i>Click Events
                            </a>
                        </div>
                    </figure>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6">
                    <figure class="mb-0 insta-section-imgs">
                        <img src="${this.config.fallbackImages[1]}" alt="Instagram Post 2" class="img-fluid">
                        <div class="hover_box_plus">
                            <a href="https://www.instagram.com/${this.config.instagramUsername}/" target="_blank" rel="noopener">
                                <i class="fa-brands fa-instagram"></i>Click Events
                            </a>
                        </div>
                    </figure>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6">
                    <figure class="mb-0 insta-section-imgs insta-section-imgs-mb">
                        <img src="${this.config.fallbackImages[2]}" alt="Instagram Post 3" class="img-fluid">
                        <div class="hover_box_plus">
                            <a href="https://www.instagram.com/${this.config.instagramUsername}/" target="_blank" rel="noopener">
                                <i class="fa-brands fa-instagram"></i>Click Events
                            </a>
                        </div>
                    </figure>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-6">
                    <figure class="mb-0 insta-section-imgs insta-section-imgs-mb">
                        <img src="${this.config.fallbackImages[3]}" alt="Instagram Post 4" class="img-fluid">
                        <div class="hover_box_plus">
                            <a href="https://www.instagram.com/${this.config.instagramUsername}/" target="_blank" rel="noopener">
                                <i class="fa-brands fa-instagram"></i>Click Events
                            </a>
                        </div>
                    </figure> 
                </div>
            </div>
        `;
        
        this.container.innerHTML = feedHtml;
    }
    
    renderFeed(posts) {
        let feedHtml = '<div class="row">';
        
        posts.slice(0, 4).forEach(post => {
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const caption = post.caption ? post.caption.substring(0, 50) + '...' : 'Click Events Instagram Post';
            
            feedHtml += `
                <div class="col-lg-3 col-md-3 col-sm-6">
                    <figure class="mb-0 insta-section-imgs">
                        <img src="${imageUrl}" alt="${caption}" class="img-fluid">
                        <div class="hover_box_plus">
                            <a href="${post.permalink}" target="_blank" rel="noopener">
                                <i class="fa-brands fa-instagram"></i>Click Events
                            </a>
                        </div>
                    </figure>
                </div>
            `;
        });
        
        feedHtml += '</div>';
        this.container.innerHTML = feedHtml;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const instagramFeed = new InstagramFeedManager(INSTAGRAM_CONFIG);
    instagramFeed.init();
});
