import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Eye, Download, MessageCircle, Calendar, Tag, Building, BookOpen, User, TrendingUp, Pin, CheckCircle, Clock } from 'lucide-react';

const NoteAnalytics = ({ 
  likeCount, 
  downloadsCount, 
  viewCount, 
  comments, 
  published, 
  subject, 
  document_type, 
  college, 
  branch, 
  author, 
  verified, 
  pinned, 
  trending, 
  tags 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate engagement rate
  const totalEngagement = likeCount + downloadsCount + comments.length;
  const engagementRate = viewCount > 0 ? ((totalEngagement / viewCount) * 100).toFixed(1) : 0;

  // Time since publication
  const publishedDate = new Date(published);
  const now = new Date();
  const daysSincePublished = Math.floor((now - publishedDate) / (1000 * 60 * 60 * 24));
  const timeSincePublished = daysSincePublished === 0 ? 'Today' : 
    daysSincePublished === 1 ? '1 day ago' : `${daysSincePublished} days ago`;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'engagement', label: 'Engagement', icon: Heart },
    { id: 'details', label: 'Details', icon: BookOpen }
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{viewCount.toLocaleString()}</div>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Downloads</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{downloadsCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Likes</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{likeCount.toLocaleString()}</div>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Comments</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{comments.length.toLocaleString()}</div>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">Engagement Rate</span>
        </div>
        <div className="text-2xl font-bold text-orange-900">{engagementRate}%</div>
        <div className="text-xs text-orange-700 mt-1">
          {totalEngagement} interactions from {viewCount} views
        </div>
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">View Rate</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">{viewCount}</div>
            <div className="text-xs text-gray-500">Total views</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Download Rate</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {viewCount > 0 ? ((downloadsCount / viewCount) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-500">{downloadsCount} downloads</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Like Rate</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {viewCount > 0 ? ((likeCount / viewCount) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-500">{likeCount} likes</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Comment Rate</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {viewCount > 0 ? ((comments.length / viewCount) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-500">{comments.length} comments</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h4 className="font-medium text-indigo-900 mb-2">Performance Insights</h4>
        <div className="space-y-2 text-sm text-indigo-800">
          {engagementRate > 5 && <div>• High engagement rate indicates quality content</div>}
          {downloadsCount > likeCount && <div>• More downloads than likes suggests practical value</div>}
          {viewCount === 0 && <div>• New content - consider promoting for visibility</div>}
          {daysSincePublished < 7 && <div>• Recently published - monitor early performance</div>}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Published</div>
            <div className="text-xs text-gray-600">{timeSincePublished}</div>
            <div className="text-xs text-gray-500">{publishedDate.toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <BookOpen className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Subject & Type</div>
            <div className="text-xs text-gray-600">{subject} • {document_type}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Building className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Institution</div>
            <div className="text-xs text-gray-600">{college}</div>
            <div className="text-xs text-gray-500">Branch: {branch?.toUpperCase()}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="h-4 w-4 text-gray-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium">Author ID</div>
            <div className="text-xs text-gray-600 font-mono">{author}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status Indicators</h4>
        <div className="flex flex-wrap gap-2">
          {verified && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              <CheckCircle className="h-3 w-3" />
              Verified
            </div>
          )}
          {pinned && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              <Pin className="h-3 w-3" />
              Pinned
            </div>
          )}
          {trending && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              <TrendingUp className="h-3 w-3" />
              Trending
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            <Clock className="h-3 w-3" />
            {daysSincePublished === 0 ? 'New' : `${daysSincePublished}d old`}
          </div>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Tag className="h-3 w-3" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Note Analytics</CardTitle>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'engagement' && renderEngagement()}
        {activeTab === 'details' && renderDetails()}
      </CardContent>
    </Card>
  );
};

export default NoteAnalytics;