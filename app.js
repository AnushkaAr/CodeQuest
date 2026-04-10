/**
 * CodeQuest Pro Final - Multi-Page Router & State Manager
 */

window.App = {
    user: null,
    profile: null,

    async init() {
        if (!window.supabase) return console.error("Supabase missing!");
        
        const { data: { session } } = await window.supabase.auth.getSession();
        
        if (session) {
            this.user = session.user;
            await this.loadProfile();
        } else {
            this.enforceRouting(); // Handle logged-out state
        }

        // Listen for login/logout events dynamically
        window.supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                this.user = session?.user;
                if(this.user) await this.loadProfile();
            } else if (event === 'SIGNED_OUT') {
                this.user = null;
                this.profile = null;
                this.enforceRouting();
            }
        });

        this.bindGlobalEvents();
    },

    async loadProfile() {
        if (!this.user) return;
        const { data, error } = await window.supabase.from('profiles').select('*').eq('id', this.user.id).single();
        if (!error && data) {
            this.profile = data;
            this.updateUI();
        }
        this.enforceRouting();
    },

    enforceRouting() {
        const path = window.location.pathname.toLowerCase();
        const isLoggedIn = !!this.user;
        const role = this.profile?.role || 'student';

        // 1. Logged Out User Checks
        if (!isLoggedIn) {
            if (path.includes('dashboard.html') || path.includes('/games/')) {
                window.location.replace('index.html'); // Kick to student login
            }
            if (path.includes('admin.html') && !path.includes('admin_login.html') && !path.includes('admin_fix')) {
                window.location.replace('admin_login.html'); // Kick to admin login
            }
            return; // Allowed to stay on index.html or admin_login.html
        }

        // 2. Logged In Admin Checks
        if (role === 'admin') {
            if (path.includes('index.html') || path.includes('dashboard.html') || path.includes('admin_login.html')) {
                window.location.replace('admin.html'); // Admins belong in the command center
            }
            return;
        }

        // 3. Logged In Student Checks
        if (role === 'student' || role !== 'admin') {
            if (path.includes('index.html') || path.includes('admin.html') || path.includes('admin_login.html')) {
                 window.location.replace('dashboard.html'); // Students belong in dashboard
            }
            return;
        }
    },

    async updateScore(points) {
        if (!this.user || !this.profile) return;
        let ns = (this.profile.score || 0) + points;
        this.profile.score = ns < 0 ? 0 : ns;
        this.updateUI();
        await window.supabase.from('profiles').update({ score: this.profile.score }).eq('id', this.user.id);
    },

    updateUI() {
        // Hydrate ALL UI elements globally
        document.querySelectorAll('.display-username').forEach(el => el.innerText = this.profile?.username || 'User');
        document.querySelectorAll('.display-score').forEach(el => el.innerText = this.profile?.score || '0');
        
        // Setup campaign levels auto-unlock if we are on dashboard
        if(typeof window.renderCampaign === 'function' && this.profile) window.renderCampaign();
        // Setup admin boards
        if(typeof window.renderAdminBoards === 'function') window.renderAdminBoards();
    },

    bindGlobalEvents() {
        document.querySelectorAll('.btn-logout').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                // 1. Visually lock the button so user knows it fired
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Exiting...';
                btn.classList.add('disabled');

                // 2. Safely trigger Supabase logout
                if (window.supabase) {
                    await window.supabase.auth.signOut();
                }
                
                // 3. Manually wipe local JS state immediately
                this.user = null;
                this.profile = null;
                
                // 4. Force browser redirect instantly based on current origin page
                if (window.location.pathname.toLowerCase().includes('admin.html')) {
                    window.location.replace('admin_login.html');
                } else {
                    window.location.replace('index.html');
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => window.App.init());
