import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Folder, ChevronDown, ChevronRight, Check } from 'lucide-react';

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

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  onClose: () => void;
}

export default function ImagePicker({ value, onChange, onClose }: ImagePickerProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [expandedAlbum, setExpandedAlbum] = useState<Set<string>>(new Set());

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
    setExpandedAlbum(new Set(loadedAlbums.map((a: Album) => a.id)));

    const savedImages = localStorage.getItem('shenxiaoyou_images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    } else {
      // 初始化默认图片
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

  const toggleAlbum = (albumId: string) => {
    const newExpanded = new Set(expandedAlbum);
    if (newExpanded.has(albumId)) {
      newExpanded.delete(albumId);
    } else {
      newExpanded.add(albumId);
    }
    setExpandedAlbum(newExpanded);
  };

  const getAlbumName = (albumId: string) => {
    return albums.find(a => a.id === albumId)?.name || '未知相册';
  };

  const filteredAlbums = selectedAlbumId
    ? albums.filter(a => a.id === selectedAlbumId)
    : albums;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">选择封面图片</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Album selector */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-gray-400" />
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">全部相册</option>
              {albums.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">暂无图片，请先到图片库上传</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {(selectedAlbumId
                ? images.filter(img => img.album_id === selectedAlbumId)
                : images
              ).map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => onChange(image.url)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    value === image.url
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1.5 bg-white">
                    <p className="text-xs text-gray-700 truncate">{image.name}</p>
                    <p className="text-xs text-gray-400">{image.size} KB</p>
                  </div>
                  {value === image.url && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {value ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>已选择图片</span>
              </>
            ) : (
              <span>请点击选择一张图片</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            {value && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                确定
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}