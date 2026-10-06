import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types/colorforge';
import { Search, Star, Trash2, Copy, ExternalLink, Plus, Edit2, Check, X } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, setProjects, setActiveSystem, setActiveTab, deleteProject, duplicateProject, toggleFavoriteProject, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const filtered = projects.filter(p =>
    p.projectName.toLowerCase().includes(search.toLowerCase()) ||
    p.websiteName.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const startRename = (proj: Project) => {
    setEditingId(proj.id);
    setEditName(proj.projectName);
  };

  const saveRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: editName.trim() }),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => (p.id === id ? { ...p, projectName: editName.trim() } : p)));
        setEditingId(null);
        showToast('Project renamed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Workspace Repository</span>
          <h1 className="text-2xl font-bold text-white mt-1">My Projects & Saved Systems</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, modify, duplicate, and export your saved brand color systems.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('generator')}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Color System
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by project title, website name, or category..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-300">No matching projects found</p>
          <p className="text-xs text-slate-500">
            {search ? 'Try clearing your search query' : 'Generate and save your first website color system.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(proj => {
            const isEditing = editingId === proj.id;
            const pal = proj.colorSystem.activeTheme === 'dark' ? proj.colorSystem.darkPalette : proj.colorSystem.lightPalette;

            return (
              <div
                key={proj.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Swatches Strip */}
                  <div className="flex h-14 rounded-xl overflow-hidden border border-slate-800 mb-4 shadow-inner">
                    <div className="flex-1" style={{ backgroundColor: pal.primary.hex }} />
                    <div className="flex-1" style={{ backgroundColor: pal.secondary.hex }} />
                    <div className="flex-1" style={{ backgroundColor: pal.accent.hex }} />
                    <div className="flex-1" style={{ backgroundColor: pal.surface.hex }} />
                    <div className="flex-1" style={{ backgroundColor: pal.background.hex }} />
                  </div>

                  {/* Title & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full rounded border border-indigo-500 bg-slate-950 px-2 py-1 text-xs text-white"
                          />
                          <button
                            onClick={() => saveRename(proj.id)}
                            className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                            {proj.projectName}
                          </h3>
                          <button
                            onClick={() => startRename(proj)}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {proj.websiteName} · <span className="text-slate-300">{proj.category}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavoriteProject(proj.id)}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                    >
                      <Star className={`h-4 w-4 ${proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Updated {new Date(proj.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      title="Duplicate project"
                      onClick={() => duplicateProject(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Delete project"
                      onClick={() => deleteProject(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveSystem(proj.colorSystem);
                        setActiveTab('palette');
                      }}
                      className="flex items-center gap-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-colors ml-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
