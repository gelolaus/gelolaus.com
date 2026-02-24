<script setup>
import { ref } from 'vue'

// Map the CLI commands to sections for the GUI
const sections = [
  { id: 'whoami', label: 'Profile', icon: 'fa-user-astronaut' },
  { id: 'ed', label: 'Education', icon: 'fa-graduation-cap' },
  { id: 'ac', label: 'Achievements', icon: 'fa-trophy' },
  { id: 'xp', label: 'Experience', icon: 'fa-briefcase' },
  { id: 'go', label: 'Goals', icon: 'fa-bullseye' }
]

const activeSection = ref('whoami')
</script>

<template>
  <div class="h-full bg-gray-900 text-gray-200 flex flex-col md:flex-row font-sans overflow-hidden select-none">
    
    <div class="w-full md:w-48 bg-black/30 border-b md:border-b-0 md:border-r border-gray-700 flex md:flex-col p-2 gap-1 overflow-x-auto md:overflow-x-visible">
      <button 
        v-for="section in sections" 
        :key="section.id"
        @click="activeSection = section.id"
        class="flex-1 md:flex-none flex items-center gap-3 px-4 py-2 rounded text-sm transition-all whitespace-nowrap"
        :class="activeSection === section.id ? 'bg-hacker-green/20 text-hacker-green border border-hacker-green/50' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'"
      >
        <i :class="['fa-solid', section.icon, 'w-5']"></i>
        <span>{{ section.label }}</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 bg-gray-900/50 relative">
      
      <div v-if="activeSection === 'whoami'" class="animate-fade-in">
        <div class="flex flex-col items-center md:items-start mb-6">
          <div class="w-24 h-24 bg-gray-800 rounded-full border-2 border-hacker-green flex items-center justify-center mb-4 overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.1)]">
              <img 
                src="/assets/pics/gelo_profile.jpg" 
                alt="Angelo Laus" 
                class="w-full h-full object-cover"
              />
          </div>
          <h1 class="text-3xl font-bold text-white uppercase tracking-tighter">Angelo Laus</h1>
          <p class="text-hacker-green font-mono text-sm mt-1 underline decoration-hacker-green/30 underline-offset-4">@gelolaus on Instagram</p>
        </div>
        <div class="prose prose-invert prose-sm max-w-none space-y-4 text-gray-300 leading-relaxed">
          <p>I am Angelo Laus, but you can call me <span class="text-white font-bold">"Gelo"</span>. I graduated from the Science, Technology, Engineering, and Mathematics with a Specialization in Information Technology (STEM-IT) strand at Asia Pacific College, Makati City.</p>
          <p>I am a <span class="text-blue-400">Notion Campus Leader</span> (one out of eight Cohort 4 Campus Leaders in the Philippines) and the Director of External Relations at JPCS-APC, a role I've been doing inside and outside college for different organizations for the past four years.</p>
        </div>
      </div>

      <div v-if="activeSection === 'ed'" class="animate-fade-in space-y-6">
        <h3 class="text-blue-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-1">Academic Background</h3>
        <div class="space-y-4">
          <div class="border-l-2 border-gray-700 pl-4 py-1">
            <h4 class="text-white font-bold">Bachelor of Science in Computer Science</h4>
            <p class="text-xs text-hacker-green italic">Specialized in Cyber Security and Forensics</p>
            <p class="text-sm text-gray-400 mt-1">Asia Pacific College, Makati City</p>
            <span class="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded mt-2 inline-block">55% Scholarship</span>
          </div>
          <div class="border-l-2 border-gray-700 pl-4 py-1">
            <h4 class="text-white font-bold">Senior High School (STEM-IT)</h4>
            <p class="text-sm text-gray-400 mt-1">Asia Pacific College, Makati City</p>
          </div>
        </div>
      </div>

      <div v-if="activeSection === 'ac'" class="animate-fade-in space-y-6">
        <div>
          <h3 class="text-yellow-500 font-mono text-xs font-bold uppercase tracking-widest border-b border-yellow-500/30 pb-1 mb-4">Certifications</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="cert in ['C3SA', 'CRTOM', 'CCEP', 'CPPS']" :key="cert" class="bg-black/30 p-2 rounded border border-gray-800 text-xs flex items-center gap-2">
              <i class="fa-solid fa-certificate text-yellow-600"></i>
              <span>Certified {{ cert }} (2025)</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-purple-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-purple-400/30 pb-1 mb-4">Capture The Flag</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <i class="fa-solid fa-award text-hacker-green mt-1"></i>
              <div>
                <p class="text-sm text-white font-bold">HackForGov 2025 Philippines Champion</p>
                <p class="text-[10px] text-gray-500">Team Akira: Requiem (National Level)</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-gray-400">
              <i class="fa-solid fa-award mt-1"></i>
              <div>
                <p class="text-sm">HackForGov 2024 NCR 2nd Runner-Up</p>
                <p class="text-[10px]">Team Akira</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="activeSection === 'xp'" class="animate-fade-in space-y-6">
        <div>
          <h3 class="text-hacker-green font-mono text-xs font-bold uppercase tracking-widest border-b border-hacker-green/30 pb-1 mb-4">Leadership Roles</h3>
          <div class="space-y-4">
             <div v-for="job in [
               { role: 'Notion Campus Leader', org: 'Notion', date: 'Sept 2025 - Present' },
               { role: 'VP of External Growth', org: 'CyberPH', date: 'April 2025 - Present' },
               { role: 'Director of External Relations', org: 'JPCS-APC', date: 'July 2025 - Present' }
             ]" :key="job.role" class="relative pl-4 border-l-2 border-hacker-green/30">
                <h4 class="text-sm font-bold text-white">{{ job.role }}</h4>
                <p class="text-xs text-gray-400">{{ job.org }} // {{ job.date }}</p>
             </div>
          </div>
        </div>
        <div>
          <h3 class="text-blue-400 font-mono text-xs font-bold uppercase tracking-widest border-b border-blue-400/30 pb-1 mb-4">IT Projects</h3>
          <div class="grid grid-cols-1 gap-2">
            <div v-for="proj in ['Event QR Registration System (APC SOAR)', 'Rangya E-Commerce System', 'Doon Ride-Hailing Comparison']" :key="proj" class="text-xs bg-gray-800/40 p-2 rounded flex items-center gap-2">
               <i class="fa-solid fa-square-rss text-blue-500"></i>
               {{ proj }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeSection === 'go'" class="animate-fade-in h-full flex flex-col justify-center items-center text-center px-4">
        <i class="fa-solid fa-rocket text-4xl text-gray-700 mb-4"></i>
        <h3 class="text-white font-bold mb-2">Primary Objective: CISO</h3>
        <p class="text-sm text-gray-400 max-w-xs mb-6">Aiming to become a Chief Information Security Officer while maintaining a path toward Summa Cum Laude honors.</p>
        <div class="flex gap-4">
          <div class="bg-blue-900/20 border border-blue-500/30 p-3 rounded text-center min-w-[120px]">
            <p class="text-[10px] text-blue-300 uppercase font-bold">Milestone</p>
            <p class="text-xs text-gray-200">ROOTCON Ticket</p>
          </div>
          <div class="bg-hacker-green/10 border border-hacker-green/30 p-3 rounded text-center min-w-[120px]">
            <p class="text-[10px] text-hacker-green uppercase font-bold">Academic</p>
            <p class="text-xs text-gray-200">Summa Cum Laude</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hide scrollbar for sidebar on mobile */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}
</style>