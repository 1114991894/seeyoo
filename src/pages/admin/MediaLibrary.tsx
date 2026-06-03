import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Copy, Check, Image, X, Upload, Folder, Edit2, Save, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface ImageItem {
  id: string;
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
  created_at: string;
  album_id: string;
}

interface Album {
  id: string;
  name: string;
  created_at: string;
}

const MAX_SIZE_KB = 300;

function compressImage(file: File): Promise<{ dataUrl: string; width: number; height: number; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        const getBase64SizeKB = (base64: string) => {
          const base64Length = base64.split(',')[1].length;
          return (base64Length * 3) / 4 / 1024;
        };

        while (getBase64SizeKB(compressedDataUrl) > MAX_SIZE_KB && quality > 0.1) {
          quality -= 0.05;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (getBase64SizeKB(compressedDataUrl) > MAX_SIZE_KB) {
          const scale = Math.sqrt(MAX_SIZE_KB / getBase64SizeKB(compressedDataUrl));
          const newWidth = Math.floor(width * scale);
          const newHeight = Math.floor(height * scale);
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          quality = 0.85;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          while (getBase64SizeKB(compressedDataUrl) > MAX_SIZE_KB && quality > 0.1) {
            quality -= 0.05;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        }

        resolve({
          dataUrl: compressedDataUrl,
          width: canvas.width,
          height: canvas.height,
          size: Math.round(getBase64SizeKB(compressedDataUrl))
        });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export default function MediaLibrary() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set());
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedAlbums = localStorage.getItem('shenxiaoyou_albums');
    let loadedAlbums: Album[];
    
    if (savedAlbums) {
      loadedAlbums = JSON.parse(savedAlbums);
    } else {
      loadedAlbums = [
        { id: 'album_default', name: '默认相册', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('shenxiaoyou_albums', JSON.stringify(loadedAlbums));
    }
    setAlbums(loadedAlbums);
    setExpandedAlbums(new Set(loadedAlbums.map(a => a.id)));

    const savedImages = localStorage.getItem('shenxiaoyou_images');
    if (savedImages) {
      const imgs: ImageItem[] = JSON.parse(savedImages);
      const updated = imgs.map(img => ({
        ...img,
        album_id: img.album_id || 'album_default'
      }));
      setImages(updated);
      if (JSON.stringify(updated) !== savedImages) {
        localStorage.setItem('shenxiaoyou_images', JSON.stringify(updated));
      }
    } else {
      const initialImages: ImageItem[] = [
        {
          id: 'img_1',
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
          name: '政策资讯封面1',
          size: 128,
          width: 400,
          height: 300,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          album_id: 'album_default'
        },
        {
          id: 'img_2',
          url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
          name: '政策资讯封面2',
          size: 96,
          width: 400,
          height: 300,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          album_id: 'album_default'
        },
        {
          id: 'img_3',
          url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
          name: '保健知识封面1',
          size: 112,
          width: 400,
          height: 300,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          album_id: 'album_default'
        },
        {
          id: 'img_4',
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
          name: '保健知识封面2',
          size: 108,
          width: 400,
          height: 300,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          album_id: 'album_default'
        }
      ];
      setImages(initialImages);
      localStorage.setItem('shenxiaoyou_images', JSON.stringify(initialImages));
    }
  };

  const saveImages = (newImages: ImageItem[]) => {
    setImages(newImages);
    localStorage.setItem('shenxiaoyou_images', JSON.stringify(newImages));
  };

  const saveAlbums = (newAlbums: Album[]) => {
    setAlbums(newAlbums);
    localStorage.setItem('shenxiaoyou_albums', JSON.stringify(newAlbums));
  };

  const toggleAlbum = (albumId: string) => {
    const newExpanded = new Set(expandedAlbums);
    if (newExpanded.has(albumId)) {
      newExpanded.delete(albumId);
    } else {
      newExpanded.add(albumId);
    }
    setExpandedAlbums(newExpanded);
  };

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      alert('请输入相册名称');
      return;
    }
    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      name: newAlbumName.trim(),
      created_at: new Date().toISOString()
    };
    saveAlbums([...albums, newAlbum]);
    setShowAlbumModal(false);
    setNewAlbumName('');
    setExpandedAlbums(new Set([...expandedAlbums, newAlbum.id]));
  };

  const handleRenameAlbum = () => {
    if (!editingAlbum || !newAlbumName.trim()) {
      alert('请输入相册名称');
      return;
    }
    saveAlbums(albums.map(a => 
      a.id === editingAlbum.id ? { ...a, name: newAlbumName.trim() } : a
    ));
    setShowRenameModal(false);
    setEditingAlbum(null);
    setNewAlbumName('');
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (albumId === 'album_default') {
      alert('默认相册不能删除');
      return;
    }
    if (!confirm('确定要删除此相册吗？相册中的图片将移至默认相册。')) return;
    
    const updatedImages = images.map(img => 
      img.album_id === albumId ? { ...img, album_id: 'album_default' } : img
    );
    saveImages(updatedImages);
    saveAlbums(albums.filter(a => a.id !== albumId));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: ImageItem[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          alert(`文件 ${file.name} 不是图片，已跳过`);
          continue;
        }

        const compressed = await compressImage(file);
        newImages.push({
          id: `img_${Date.now()}_${i}`,
          url: compressed.dataUrl,
          name: file.name.replace(/\.[^/.]+$/, '') || `图片${Date.now()}_${i}`,
          size: compressed.size,
          width: compressed.width,
          height: compressed.height,
          created_at: new Date().toISOString(),
          album_id: selectedAlbumId || 'album_default'
        });
      }
      
      saveImages([...images, ...newImages]);
      setShowUploadModal(false);
      setSelectedAlbumId('');
      alert(`成功上传 ${newImages.length} 张图片`);
    } catch (err) {
      console.error('上传失败:', err);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = (id: string) => {
    if (!confirm('确定要删除这张图片吗？')) return;
    saveImages(images.filter(img => img.id !== id));
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('复制失败，请手动复制');
    }
  };

  const handleUploadClick = () => {
    setSelectedAlbumId('');
    setShowUploadModal(true);
  };

  const renderAlbumSection = (album: Album) => {
    const albumImages = images.filter(img => img.album_id === album.id);
    const isExpanded = expandedAlbums.has(album.id);
    const filteredAlbumImages = albumImages.filter(img =>
      img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div key={album.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div
          className="bg-gray-50 px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => toggleAlbum(album.id)}
        >
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
            <Folder className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-medium text-gray-800">{album.name}</span>
            <span className="text-xs text-gray-500">({albumImages.length} 张)</span>
          </div>
          {album.id !== 'album_default' && (
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setEditingAlbum(album);
                  setNewAlbumName(album.name);
                  setShowRenameModal(true);
                }}
                className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="重命名"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="删除相册"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-6">
            {filteredAlbumImages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                {albumImages.length === 0 ? '此相册暂无图片' : '没有匹配的图片'}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAlbumImages.map((image) => (
                  <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-800 truncate mb-1">{image.name}</p>
                      <p className="text-xs text-gray-400 mb-2">
                        {image.size} KB · {image.width}×{image.height}
                      </p>
                      <button
                        onClick={() => handleCopy(image.url, image.id)}
                        className={`w-full flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                          copiedId === image.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {copiedId === image.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>复制链接</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">图片库管理</h1>
            <p className="text-gray-500 mt-1">管理平台图片资源，按相册分组</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAlbumModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Folder className="w-4 h-4" />
              <span>新建相册</span>
            </button>
            <button
              onClick={handleUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>添加图片</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索图片名称"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full md:w-96"
            />
          </div>
        </div>

        <div className="space-y-4">
          {albums.map(album => renderAlbumSection(album))}
        </div>

        {albums.length === 0 && (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无相册</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">添加图片</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  选择相册
                </label>
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">默认相册</option>
                  {albums.filter(a => a.id !== 'album_default').map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  选择图片（支持多选）
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  图片将自动压缩至 {MAX_SIZE_KB}KB 以内
                </p>
              </div>

              {uploading && (
                <div className="text-center py-2 text-purple-600 text-xs">
                  正在上传并压缩图片...
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? '上传中...' : '上传'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">新建相册</h2>
              <button
                onClick={() => setShowAlbumModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  相册名称
                </label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="请输入相册名称"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAlbumModal(false);
                    setNewAlbumName('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateAlbum}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>创建</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && editingAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">重命名相册</h2>
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setEditingAlbum(null);
                  setNewAlbumName('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  相册名称
                </label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="请输入新名称"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRenameModal(false);
                    setEditingAlbum(null);
                    setNewAlbumName('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRenameAlbum}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
