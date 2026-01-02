import React, { useState, useMemo } from 'react';
import { MOCK_HOMEWORK, MOCK_NOTES, MOCK_TEAMS_MESSAGES } from '../constants';
import { Homework, Note, TeamsMessage } from '../types';

interface MaterialsProps {
    onGeneratePodcast: (title: string, content: string) => void;
}

const Materials: React.FC<MaterialsProps> = ({ onGeneratePodcast }) => {
  // Local state initialized with mock data to support adding new items
  const [homeworks, setHomeworks] = useState<Homework[]>(MOCK_HOMEWORK);
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [messages, setMessages] = useState<TeamsMessage[]>(MOCK_TEAMS_MESSAGES);
  
  // UI State
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'homework' | 'note' | 'message'>('homework');

  // Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: string | null;
    type: 'homework' | 'note' | 'message' | null;
  }>({ isOpen: false, itemId: null, type: null });

  // Filter States
  const [homeworkFilter, setHomeworkFilter] = useState<'Vše' | 'Bakaláři' | 'Teams'>('Vše');
  const [notesFilter, setNotesFilter] = useState<string>('Vše');
  const [messagesFilter, setMessagesFilter] = useState<'Vše' | 'Důležité'>('Vše');

  // Form State
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    date: '',
    sender: '',
    platform: 'Bakaláři',
    important: false
  });

  // Derived Data for Filters
  const noteSubjects = useMemo(() => {
    const subjects = new Set(notes.map(n => n.subject));
    return ['Vše', ...Array.from(subjects)];
  }, [notes]);

  // Filtering Logic
  const filteredHomeworks = useMemo(() => {
    const s = search.toLowerCase();
    return homeworks.filter(h => {
      const matchesSearch = h.subject.toLowerCase().includes(s) || 
                            h.title.toLowerCase().includes(s) || 
                            h.description.toLowerCase().includes(s);
      const matchesFilter = homeworkFilter === 'Vše' || h.platform === homeworkFilter;
      return matchesSearch && matchesFilter;
    });
  }, [homeworks, search, homeworkFilter]);

  const filteredNotes = useMemo(() => {
    const s = search.toLowerCase();
    return notes.filter(n => {
      const matchesSearch = n.subject.toLowerCase().includes(s) || 
                            n.topic.toLowerCase().includes(s) || 
                            n.content.toLowerCase().includes(s);
      const matchesFilter = notesFilter === 'Vše' || n.subject === notesFilter;
      return matchesSearch && matchesFilter;
    });
  }, [notes, search, notesFilter]);

  const filteredMessages = useMemo(() => {
    const s = search.toLowerCase();
    return messages.filter(m => {
      const matchesSearch = m.sender.toLowerCase().includes(s) || 
                            m.content.toLowerCase().includes(s);
      const matchesFilter = messagesFilter === 'Vše' || (messagesFilter === 'Důležité' ? m.important : true);
      return matchesSearch && matchesFilter;
    });
  }, [messages, search, messagesFilter]);

  // Handle Add Material
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();

    if (activeTab === 'homework') {
      const newItem: Homework = {
        id,
        subject: formData.subject || 'Obecné',
        title: formData.title || 'Úkol bez názvu',
        dueDate: formData.date || new Date().toISOString().split('T')[0],
        description: formData.description,
        platform: formData.platform as 'Bakaláři' | 'Teams',
        completed: false
      };
      setHomeworks([newItem, ...homeworks]);
    } else if (activeTab === 'note') {
      const newItem: Note = {
        id,
        subject: formData.subject || 'Obecné',
        topic: formData.title || 'Poznámka bez názvu', // Reuse title as topic
        date: new Date().toISOString().split('T')[0],
        content: formData.description // Reuse description as content
      };
      setNotes([newItem, ...notes]);
    } else {
      const newItem: TeamsMessage = {
        id,
        sender: formData.sender || 'Neznámý',
        content: formData.description, // Reuse description as content
        timestamp: new Date().toLocaleString('cs-CZ', { hour12: false }).slice(0, 16),
        important: formData.important
      };
      setMessages([newItem, ...messages]);
    }

    // Reset and Close
    setIsModalOpen(false);
    setFormData({
      subject: '',
      title: '',
      description: '',
      date: '',
      sender: '',
      platform: 'Bakaláři',
      important: false
    });
  };

  // Handle Delete
  const openDeleteModal = (id: string, type: 'homework' | 'note' | 'message') => {
    setDeleteConfirmation({ isOpen: true, itemId: id, type });
  };

  const confirmDelete = () => {
    const { itemId, type } = deleteConfirmation;
    if (itemId && type) {
      if (type === 'homework') {
        setHomeworks(prev => prev.filter(h => h.id !== itemId));
      } else if (type === 'note') {
        setNotes(prev => prev.filter(n => n.id !== itemId));
      } else if (type === 'message') {
        setMessages(prev => prev.filter(m => m.id !== itemId));
      }
    }
    setDeleteConfirmation({ isOpen: false, itemId: null, type: null });
  };

  // Handle Toggle Completion
  const toggleHomeworkCompletion = (id: string) => {
    setHomeworks(prev => prev.map(hw => 
        hw.id === id ? { ...hw, completed: !hw.completed } : hw
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="relative flex-1 w-full md:w-auto">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Hledat úkoly, poznámky nebo zprávy..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 transition-all"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Přidat Materiál
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Homework Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 bg-orange-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
              <span className="mr-2">📝</span> Domácí úkoly
            </h3>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">Bakaláři</span>
          </div>
          {/* Homework Filters */}
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex space-x-2 overflow-x-auto no-scrollbar">
            {['Vše', 'Bakaláři', 'Teams'].map(filter => (
              <button
                key={filter}
                onClick={() => setHomeworkFilter(filter as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  homeworkFilter === filter 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredHomeworks.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Žádné odpovídající úkoly.</p>}
            {filteredHomeworks.map((hw: Homework) => (
              <div key={hw.id} className={`p-3 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors group ${hw.completed ? 'opacity-70' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{hw.subject}</span>
                  <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleHomeworkCompletion(hw.id); }}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all flex items-center gap-1 cursor-pointer hover:shadow-sm ${hw.completed ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        title={hw.completed ? "Označit jako nedokončené" : "Označit jako hotové"}
                    >
                        {hw.completed ? (
                             <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Hotovo
                             </>
                        ) : (
                             <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {hw.dueDate}
                             </>
                        )}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onGeneratePodcast(hw.title, hw.description); }}
                        className="text-slate-400 hover:text-violet-600 transition-colors p-1 rounded-md hover:bg-violet-50"
                        title="Vytvořit Podcast"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(hw.id, 'homework'); }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        title="Smazat úkol"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <h4 className={`font-semibold text-slate-800 mb-1 group-hover:text-orange-700 ${hw.completed ? 'line-through text-slate-500' : ''}`}>{hw.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-2">{hw.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 bg-blue-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
              <span className="mr-2">📓</span> Sešity
            </h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">Poznámky</span>
          </div>
          {/* Notes Filters */}
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex space-x-2 overflow-x-auto no-scrollbar">
            {noteSubjects.map(filter => (
              <button
                key={filter}
                onClick={() => setNotesFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  notesFilter === filter 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredNotes.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Žádné odpovídající poznámky.</p>}
            {filteredNotes.map((note: Note) => (
              <div key={note.id} className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group">
                 <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{note.subject}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">{note.date}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onGeneratePodcast(note.topic, note.content); }}
                        className="text-slate-400 hover:text-violet-600 transition-colors p-1 rounded-md hover:bg-violet-50"
                        title="Vytvořit Podcast"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); openDeleteModal(note.id, 'note'); }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        title="Smazat poznámku"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-700">{note.topic}</h4>
                <p className="text-sm text-slate-600 line-clamp-3">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

         {/* Teams Section */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-fit lg:col-span-2 xl:col-span-1">
          <div className="p-4 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
              <span className="mr-2">💬</span> Teams Zprávy
            </h3>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">MS Teams</span>
          </div>
          {/* Teams Filters */}
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex space-x-2 overflow-x-auto no-scrollbar">
            {['Vše', 'Důležité'].map(filter => (
              <button
                key={filter}
                onClick={() => setMessagesFilter(filter as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  messagesFilter === filter 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredMessages.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Žádné odpovídající zprávy.</p>}
            {filteredMessages.map((msg: TeamsMessage) => (
              <div key={msg.id} className="flex space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 group">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                   {msg.sender.charAt(0)}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-baseline">
                     <h4 className="text-sm font-semibold text-slate-800">{msg.sender}</h4>
                     <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">{msg.timestamp.split(' ')[1]}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onGeneratePodcast(msg.sender, msg.content); }}
                            className="text-slate-400 hover:text-violet-600 transition-colors p-1 rounded-md hover:bg-violet-50"
                            title="Vytvořit Podcast"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); openDeleteModal(msg.id, 'message'); }}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                            title="Smazat zprávu"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                   </div>
                   <p className="text-sm text-slate-600 mt-1">{msg.content}</p>
                   {msg.important && (
                     <span className="inline-block mt-2 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                       Důležité
                     </span>
                   )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
              <div className="flex border-b border-slate-100">
                 {[
                    {id: 'homework', label: 'Úkol'}, 
                    {id: 'note', label: 'Poznámka'}, 
                    {id: 'message', label: 'Zpráva'}
                 ].map(type => (
                    <button
                       key={type.id}
                       onClick={() => setActiveTab(type.id as any)}
                       className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                          activeTab === type.id 
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                       }`}
                    >
                       {type.label}
                    </button>
                 ))}
              </div>
              
              <form onSubmit={handleAdd} className="p-6 space-y-5">
                 <div className="space-y-4">
                    {/* Dynamic Fields */}
                    {activeTab === 'homework' && (
                       <>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Předmět</label>
                                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="např. Matematika" />
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Termín</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                             </div>
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Název úkolu</label>
                             <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="např. Pracovní list" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Platforma</label>
                            <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="Bakaláři">Bakaláři</option>
                                <option value="Teams">Teams</option>
                            </select>
                          </div>
                       </>
                    )}

                    {activeTab === 'note' && (
                       <>
                          <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Předmět</label>
                                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="např. Dějepis" />
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Téma</label>
                             <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="např. Studená válka" />
                          </div>
                       </>
                    )}

                    {activeTab === 'message' && (
                       <>
                          <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Odesílatel</label>
                                <input required type="text" value={formData.sender} onChange={e => setFormData({...formData, sender: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="např. Pan Učitel" />
                          </div>
                          <div className="flex items-center space-x-2">
                                <input type="checkbox" id="important" checked={formData.important} onChange={e => setFormData({...formData, important: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                <label htmlFor="important" className="text-sm text-slate-700">Označit jako důležité</label>
                          </div>
                       </>
                    )}

                    {/* Common Description/Content Field */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            {activeTab === 'message' ? 'Text zprávy' : 'Popis / Obsah'}
                        </label>
                        <textarea 
                           required 
                           value={formData.description} 
                           onChange={e => setFormData({...formData, description: e.target.value})} 
                           className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" 
                           placeholder={activeTab === 'message' ? "Zadejte text zprávy..." : "Zadejte podrobnosti..."}
                        />
                    </div>
                 </div>

                 <div className="flex gap-3 pt-2">
                    <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                       Zrušit
                    </button>
                    <button 
                       type="submit" 
                       className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                       Uložit
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all p-6">
              <div className="text-center">
                 <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Smazat položku?</h3>
                 <p className="text-sm text-slate-500 mb-6">
                   Opravdu chcete smazat tuto položku? Tato akce je nevratná.
                 </p>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setDeleteConfirmation({ isOpen: false, itemId: null, type: null })}
                       className="flex-1 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                       Zrušit
                    </button>
                    <button 
                       onClick={confirmDelete}
                       className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                       Smazat
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Materials;